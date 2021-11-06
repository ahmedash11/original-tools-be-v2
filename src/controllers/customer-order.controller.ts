import {Filter, repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Order} from '../models';
import {CustomerRepository} from '../repositories';

export class CustomerOrderController {
  constructor(
    @repository(CustomerRepository)
    protected customerRepository: CustomerRepository,
  ) {}

  @get('/customers/{id}/orders', {
    responses: {
      '200': {
        description: 'Array of Customer has many Order through OrderProduct',
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
    return this.customerRepository.orders(id).find(filter);
  }
}
