import {Filter, repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Order} from '../models';
import {ShopsRepository} from '../repositories';

export class ShopsOrderController {
  constructor(
    @repository(ShopsRepository) protected shopsRepository: ShopsRepository,
  ) {}

  @get('/shops/{id}/orders', {
    responses: {
      '200': {
        description: 'Array of Shops has many Order through OrderProduct',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Order)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Order>,
  ): Promise<Order[]> {
    return this.shopsRepository.orders(id).find(filter);
  }
}
