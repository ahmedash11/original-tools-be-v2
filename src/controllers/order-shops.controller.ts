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
import {
Order,
OrderProduct,
Shops,
} from '../models';
import {OrderRepository} from '../repositories';

export class OrderShopsController {
  constructor(
    @repository(OrderRepository) protected orderRepository: OrderRepository,
  ) { }

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

  @post('/orders/{id}/shops', {
    responses: {
      '200': {
        description: 'create a Shops model instance',
        content: {'application/json': {schema: getModelSchemaRef(Shops)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Order.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shops, {
            title: 'NewShopsInOrder',
            exclude: ['id'],
          }),
        },
      },
    }) shops: Omit<Shops, 'id'>,
  ): Promise<Shops> {
    return this.orderRepository.shops(id).create(shops);
  }

  @patch('/orders/{id}/shops', {
    responses: {
      '200': {
        description: 'Order.Shops PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shops, {partial: true}),
        },
      },
    })
    shops: Partial<Shops>,
    @param.query.object('where', getWhereSchemaFor(Shops)) where?: Where<Shops>,
  ): Promise<Count> {
    return this.orderRepository.shops(id).patch(shops, where);
  }

  @del('/orders/{id}/shops', {
    responses: {
      '200': {
        description: 'Order.Shops DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Shops)) where?: Where<Shops>,
  ): Promise<Count> {
    return this.orderRepository.shops(id).delete(where);
  }
}
