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
import {Product, Shops} from '../../models';
import {ShopsRepository} from '../../repositories';

export class ShopsProductController {
  constructor(
    @repository(ShopsRepository) protected shopsRepository: ShopsRepository,
  ) {}

  @get('/shops/{id}/products', {
    responses: {
      '200': {
        description: 'Array of Shops has many Product through ProductShop',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Product>,
  ): Promise<Product[]> {
    return this.shopsRepository.products(id).find(filter);
  }

  @post('/shops/{id}/products', {
    responses: {
      '200': {
        description: 'create a Product model instance',
        content: {'application/json': {schema: getModelSchemaRef(Product)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Shops.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProductInShops',
            exclude: ['id'],
          }),
        },
      },
    })
    product: Omit<Product, 'id'>,
  ): Promise<Product> {
    return this.shopsRepository.products(id).create(product);
  }

  @patch('/shops/{id}/products', {
    responses: {
      '200': {
        description: 'Shops.Product PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
    product: Partial<Product>,
    @param.query.object('where', getWhereSchemaFor(Product))
    where?: Where<Product>,
  ): Promise<Count> {
    return this.shopsRepository.products(id).patch(product, where);
  }

  @del('/shops/{id}/products', {
    responses: {
      '200': {
        description: 'Shops.Product DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Product))
    where?: Where<Product>,
  ): Promise<Count> {
    return this.shopsRepository.products(id).delete(where);
  }
}
