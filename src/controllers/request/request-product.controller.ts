import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Product, Request} from '../../models';
import {RequestRepository} from '../../repositories';

export class RequestProductController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
  ) {}

  @get('/requests/{id}/product', {
    responses: {
      '200': {
        description: 'Product belonging to Request',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  async getProduct(
    @param.path.number('id') id: typeof Request.prototype.id,
  ): Promise<Product> {
    return this.requestRepository.product(id);
  }
}
