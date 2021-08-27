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
import {Brand} from '../../models';
import {BrandRepository, UserRepository} from '../../repositories';
import {generateSlug, getFilesAndFields} from '../../services';
import {FileUploadHandler} from '../../types';
export class BrandController {
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(BrandRepository)
    public brandRepository: BrandRepository,
  ) {}

  @post('/brands', {
    responses: {
      '200': {
        description: 'Brand model instance',
        content: {'application/json': {schema: getModelSchemaRef(Brand)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Brand, {
            title: 'NewBrand',
            exclude: ['id'],
          }),
        },
      },
    })
    brand: Omit<Brand, 'id'>,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Brand> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    brand.slug = generateSlug(brand.title);

    if ((await currenrUser).role == 'owner') {
      return this.brandRepository.create(brand);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @get('/brands/count', {
    responses: {
      '200': {
        description: 'Brand model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Brand) where?: Where<Brand>): Promise<Count> {
    return this.brandRepository.count(where);
  }

  @get('/brands', {
    responses: {
      '200': {
        description: 'Array of Brand model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Brand, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Brand) filter?: Filter<Brand>): Promise<Brand[]> {
    return this.brandRepository.find(filter);
  }

  @patch('/brands', {
    responses: {
      '200': {
        description: 'Brand PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Brand, {partial: true}),
        },
      },
    })
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    brand: Brand,
    @param.where(Brand) where?: Where<Brand>,
  ): Promise<Count> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);

    if ((await currenrUser).role == 'owner') {
      return this.brandRepository.updateAll(brand, where);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @get('/brands/{slug}', {
    responses: {
      '200': {
        description: 'Brand model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Brand, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findBySlug(
    @param.path.string('slug') slug: string,
    @param.filter(Brand, {exclude: 'where'})
    filter?: FilterExcludingWhere<Brand>,
  ): Promise<Brand | null> {
    return this.brandRepository.findOne({
      where: {
        slug: slug,
      },
      ...filter,
    });
  }

  @patch('/brands/{id}', {
    responses: {
      '200': {
        description: 'Brand model instance',
        content: {'application/json': {schema: getModelSchemaRef(Brand)}},
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Brand, {partial: true}),
        },
      },
    })
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    brand: Brand,
  ): Promise<Brand> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      brand.slug = generateSlug(brand.title);
      await this.brandRepository.updateById(id, brand);
      return this.brandRepository.findById(id);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @put('/brands/{id}', {
    responses: {
      '204': {
        description: 'Brand PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() brand: Brand,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      await this.brandRepository.replaceById(id, brand);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @post('/brands/upload', {
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
  @authenticate('jwt')
  async fileUpload(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<object> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      return new Promise<object>((resolve, reject) => {
        this.handler(request, response, (err: unknown) => {
          if (err) reject(err);
          else {
            resolve(getFilesAndFields(request, 'brands'));
          }
        });
      });
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @del('/brands/{id}', {
    responses: {
      '204': {
        description: 'Brand DELETE success',
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
      await this.brandRepository.deleteById(id);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }
}
