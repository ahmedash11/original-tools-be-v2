import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  DefaultTransactionalRepository,
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
} from '@loopback/rest';
import {DbDataSource} from '../../datasources';
import {Address, Customer, Order} from '../../models';
import {
  AddressRepository,
  CustomerRepository,
  OrderProductRepository,
  OrderRepository,
} from '../../repositories';

export class OrderController {
  constructor(
    @inject('datasources.db') private dataSource: DbDataSource,
    @repository(OrderRepository)
    public orderRepository: OrderRepository,
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @repository(AddressRepository)
    public addressRepository: AddressRepository,
    @repository(OrderProductRepository)
    public orderProductRepository: OrderProductRepository,
  ) {}

  @post('/orders', {
    responses: {
      '200': {
        description: 'Order model instance',
        content: {'application/json': {schema: getModelSchemaRef(Order)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            address: Address,
            customer: Customer,
            products: Object,
            total: Number,
          },
        },
      },
    })
    order: {
      address: Address;
      customer: Customer;
      products: object[];
      total: number;
    },
  ): Promise<Order> {
    const repo = new DefaultTransactionalRepository(Order, this.dataSource);
    try {
      const {customer, address, products, total} = order;
      const customerData = await this.customerRepository.create(customer);
      await this.addressRepository.create(address);
      let orderData = {
        customerId: customerData.id,
        total: total,
        orderDate: new Date(),
      };
      let newOrder = await this.orderRepository.create(orderData);
      await this.orderProductRepository.createAll(
        products.map(product => ({...product, orderId: newOrder.id})),
      );
      return newOrder;
    } catch (err) {
      throw err;
    }
  }

  @get('/orders/count', {
    responses: {
      '200': {
        description: 'Order model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Order) where?: Where<Order>): Promise<Count> {
    return this.orderRepository.count(where);
  }

  @get('/orders', {
    responses: {
      '200': {
        description: 'Array of Order model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Order, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Order) filter?: Filter<Order>): Promise<Order[]> {
    return this.orderRepository.find(filter);
  }

  @patch('/orders', {
    responses: {
      '200': {
        description: 'Order PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true}),
        },
      },
    })
    order: Order,
    @param.where(Order) where?: Where<Order>,
  ): Promise<Count> {
    return this.orderRepository.updateAll(order, where);
  }

  @get('/orders/{id}', {
    responses: {
      '200': {
        description: 'Order model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Order, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Order, {exclude: 'where'})
    filter?: FilterExcludingWhere<Order>,
  ): Promise<Order> {
    return this.orderRepository.findById(id, filter);
  }

  @patch('/orders/{id}', {
    responses: {
      '204': {
        description: 'Order PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true}),
        },
      },
    })
    order: Order,
  ): Promise<void> {
    await this.orderRepository.updateById(id, order);
  }

  @put('/orders/{id}', {
    responses: {
      '204': {
        description: 'Order PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() order: Order,
  ): Promise<void> {
    await this.orderRepository.replaceById(id, order);
  }

  @del('/orders/{id}', {
    responses: {
      '204': {
        description: 'Order DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.orderRepository.deleteById(id);
  }
}
