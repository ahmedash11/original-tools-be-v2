import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Product, Type} from '../../models';
import {ProductRepository} from '../../repositories';

export class ProductTypeController {
  constructor(
    @repository(ProductRepository)
    protected productRepository: ProductRepository,
  ) {}

  @get('/products/{id}/types', {
    responses: {
      '200': {
        description: 'Array of Product has many Type through ProductType',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Type)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Type>,
  ): Promise<Type[]> {
    return this.productRepository.types(id).find(filter);
  }

  @post('/products/{id}/types', {
    responses: {
      '200': {
        description: 'create a Type model instance',
        content: {'application/json': {schema: getModelSchemaRef(Type)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Product.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Type, {
            title: 'NewTypeInProduct',
            exclude: ['id'],
          }),
        },
      },
    })
    type: Omit<Type, 'id'>,
  ): Promise<Type> {
    return this.productRepository.types(id).create(type);
  }

  @patch('/products/{id}/types', {
    responses: {
      '200': {
        description: 'Product.Type PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Type, {partial: true}),
        },
      },
    })
    type: Partial<Type>,
    @param.query.object('where', getWhereSchemaFor(Type)) where?: Where<Type>,
  ): Promise<Count> {
    return this.productRepository.types(id).patch(type, where);
  }

  @del('/products/{id}/types', {
    responses: {
      '200': {
        description: 'Product.Type DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Type)) where?: Where<Type>,
  ): Promise<Count> {
    return this.productRepository.types(id).delete(where);
  }
}
