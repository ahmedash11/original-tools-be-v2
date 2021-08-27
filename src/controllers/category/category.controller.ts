import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {FILE_UPLOAD_SERVICE} from '../../keys';
import {Category} from '../../models';
import {CategoryRepository, UserRepository} from '../../repositories';
import {generateSlug, getFilesAndFields} from '../../services';
import {FileUploadHandler} from '../../types';

export class CategoryController {
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,

    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @post('/categories', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {'application/json': {schema: getModelSchemaRef(Category)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {
            title: 'NewCategory',
            exclude: ['id'],
          }),
        },
      },
    })
    category: Omit<Category, 'id'>,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Category> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      category.slug = generateSlug(category.title);
      return this.categoryRepository.create(category);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @get('/categories/count', {
    responses: {
      '200': {
        description: 'Category model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Category) where?: Where<Category>): Promise<Count> {
    return this.categoryRepository.count(where);
  }

  @get('/categories', {
    responses: {
      '200': {
        description: 'Array of Category model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Category, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Category) filter?: Filter<Category>,
  ): Promise<Category[]> {
    return this.categoryRepository.find(filter);
  }

  @patch('/categories', {
    responses: {
      '200': {
        description: 'Category PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    category: Category,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);

    if ((await currenrUser).role == 'owner') {
      return this.categoryRepository.updateAll(category, where);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @get('/categories/{slug}', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Category, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findBySlug(
    @param.path.string('slug') slug: string,
    @param.filter(Category, {exclude: 'where'})
    filter?: FilterExcludingWhere<Category>,
  ): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: {
        slug: slug,
      },
      ...filter,
    });
  }

  @del('/categories/{slug}', {
    responses: {
      '204': {
        description: 'Category DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteBySlug(
    @param.path.string('slug') slug: string,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      await this.categoryRepository.deleteAll({
        slug: slug,
      });
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @patch('/categories/{id}', {
    responses: {
      '204': {
        description: 'Category PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    category: Category,
  ): Promise<Category> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      category.slug = generateSlug(category.title);
      await this.categoryRepository.updateById(id, category);
      return this.categoryRepository.findById(id);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @put('/categories/{id}', {
    responses: {
      '204': {
        description: 'Category PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody() category: Category,
  ): Promise<void> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      await this.categoryRepository.replaceById(id, category);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @post('/categories/upload', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  async fileUpload(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve(getFilesAndFields(request, 'category'));
        }
      });
    });
  }

  @del('/categories/{id}', {
    responses: {
      '204': {
        description: 'Category DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      await this.categoryRepository.deleteById(id);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }
}
