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
  requestBody,
  response,
} from '@loopback/rest';
import {ProductShop} from '../../models';
import {ProductShopRepository} from '../../repositories';

export class ShopProductContollerController {
  constructor(
    @repository(ProductShopRepository)
    public productShopRepository: ProductShopRepository,
  ) {}

  @post('/product-shops')
  @response(200, {
    description: 'ProductShop model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProductShop)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductShop, {
            title: 'NewProductShop',
            exclude: ['id'],
          }),
        },
      },
    })
    productShop: Omit<ProductShop, 'id'>,
  ): Promise<ProductShop> {
    return this.productShopRepository.create(productShop);
  }

  @get('/product-shops/count')
  @response(200, {
    description: 'ProductShop model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProductShop) where?: Where<ProductShop>,
  ): Promise<Count> {
    return this.productShopRepository.count(where);
  }

  @get('/product-shops')
  @response(200, {
    description: 'Array of ProductShop model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProductShop, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProductShop) filter?: Filter<ProductShop>,
  ): Promise<ProductShop[]> {
    return this.productShopRepository.find(filter);
  }

  @patch('/product-shops')
  @response(200, {
    description: 'ProductShop PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductShop, {partial: true}),
        },
      },
    })
    productShop: ProductShop,
    @param.where(ProductShop) where?: Where<ProductShop>,
  ): Promise<Count> {
    return this.productShopRepository.updateAll(productShop, where);
  }

  @get('/product-shops/{id}')
  @response(200, {
    description: 'ProductShop model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProductShop, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ProductShop, {exclude: 'where'})
    filter?: FilterExcludingWhere<ProductShop>,
  ): Promise<ProductShop> {
    return this.productShopRepository.findById(id, filter);
  }

  @patch('/product-shops/{id}')
  @response(204, {
    description: 'ProductShop PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductShop, {partial: true}),
        },
      },
    })
    productShop: ProductShop,
  ): Promise<void> {
    await this.productShopRepository.updateById(id, productShop);
  }

  @put('/product-shops/{id}')
  @response(204, {
    description: 'ProductShop PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() productShop: ProductShop,
  ): Promise<void> {
    await this.productShopRepository.replaceById(id, productShop);
  }

  @del('/product-shops/{id}')
  @response(204, {
    description: 'ProductShop DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productShopRepository.deleteById(id);
  }
}
