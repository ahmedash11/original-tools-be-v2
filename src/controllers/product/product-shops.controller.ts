import {Filter, repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Shops} from '../../models';
import {ProductRepository} from '../../repositories';

export class ProductShopsController {
  constructor(
    @repository(ProductRepository)
    protected productRepository: ProductRepository,
  ) {}

  @get('/products/{id}/shops', {
    responses: {
      '200': {
        description: 'Array of Product has many Shops through ProductShop',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Shops)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Shops>,
  ): Promise<Shops[]> {
    return this.productRepository.shops(id).find(filter);
  }
}
