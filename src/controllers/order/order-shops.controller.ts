import {Filter, repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Shops} from '../../models';
import {OrderRepository} from '../../repositories';

export class OrderShopsController {
  constructor(
    @repository(OrderRepository) protected orderRepository: OrderRepository,
  ) {}

  @get('/orders/{id}/shops', {
    responses: {
      '200': {
        description: 'Array of Order has many Shops through OrderProduct',
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
    return this.orderRepository.shops(id).find(filter);
  }
}
