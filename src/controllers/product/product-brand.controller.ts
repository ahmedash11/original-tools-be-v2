import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Brand, Product} from '../../models';
import {ProductRepository} from '../../repositories';

export class ProductBrandController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) {}

  @get('/products/{id}/brand', {
    responses: {
      '200': {
        description: 'Brand belonging to Product',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Brand)},
          },
        },
      },
    },
  })
  async getBrand(
    @param.path.number('id') id: typeof Product.prototype.id,
  ): Promise<Brand> {
    return this.productRepository.brand(id);
  }
}
