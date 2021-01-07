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
  param,
  patch,
  post,
  put,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {FILE_UPLOAD_SERVICE} from '../../keys';
import {Brand} from '../../models';
import {BrandRepository} from '../../repositories';
import {getFilesAndFields} from '../../services';
import {FileUploadHandler} from '../../types';
export class BrandController {
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
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
  ): Promise<Brand> {
    return this.brandRepository.create(brand);
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
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Brand, {partial: true}),
        },
      },
    })
    brand: Brand,
    @param.where(Brand) where?: Where<Brand>,
  ): Promise<Count> {
    return this.brandRepository.updateAll(brand, where);
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

  // @patch('/brands/{slug}', {
  //   responses: {
  //     '204': {
  //       description: 'Brand PATCH success',
  //     },
  //   },
  // })
  // async updateBySlug(
  //   @param.path.string('slug') slug: string,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Brand, {partial: true}),
  //       },
  //     },
  //   })
  //   brand: Brand,
  // ): Promise<void> {
  //   await this.brandRepository.updateAll(brand, {slug: slug});
  // }

  // @del('/brands/{slug}', {
  //   responses: {
  //     '204': {
  //       description: 'Brand DELETE success',
  //     },
  //   },
  // })
  // async deleteBySlug(@param.path.string('slug') slug: string): Promise<void> {
  //   await this.brandRepository.deleteAll({
  //     slug: slug,
  //   });
  // }

  // @get('/brands/{id}', {
  //   responses: {
  //     '200': {
  //       description: 'Brand model instance',
  //       content: {
  //         'application/json': {
  //           schema: getModelSchemaRef(Brand, {includeRelations: true}),
  //         },
  //       },
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.number('id') id: number,
  //   @param.filter(Brand, {exclude: 'where'})
  //   filter?: FilterExcludingWhere<Brand>,
  // ): Promise<Brand> {
  //   return this.brandRepository.findById(id, filter);
  // }

  @patch('/brands/{id}', {
    responses: {
      '200': {
        description: 'Brand model instance',
        content: {'application/json': {schema: getModelSchemaRef(Brand)}},
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Brand, {partial: true}),
        },
      },
    })
    brand: Brand,
  ): Promise<Brand> {
    await this.brandRepository.updateById(id, brand);
    return this.brandRepository.findById(id);
  }

  @put('/brands/{id}', {
    responses: {
      '204': {
        description: 'Brand PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() brand: Brand,
  ): Promise<void> {
    await this.brandRepository.replaceById(id, brand);
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
  async fileUpload(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve(getFilesAndFields(request, 'brands'));
        }
      });
    });
  }

  @del('/brands/{id}', {
    responses: {
      '204': {
        description: 'Brand DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.brandRepository.deleteById(id);
  }
}
