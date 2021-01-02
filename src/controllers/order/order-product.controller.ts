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
import {Order, Product} from '../../models';
import {OrderProductRepository, OrderRepository} from '../../repositories';

export class OrderProductController {
  constructor(
    @repository(OrderRepository) protected orderRepository: OrderRepository,
    @repository(OrderProductRepository)
    protected orderProductRepository: OrderProductRepository,
  ) {}

  @get('/orders/{id}/products', {
    responses: {
      '200': {
        description: 'Array of Order has many Product through OrderProduct',
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
  ): Promise<any[]> {
    let relation = await this.orderProductRepository.find({
      where: {
        orderId: id,
      },
    });
    let data = [];
    data = await this.orderRepository.products(id).find(filter);
    data = data.map(product => {
      return {
        ...product,
        orderQuantity: relation.find(rel => rel.productId === product.id)
          ?.quantity,
      };
    });
    return data;
  }

  @post('/orders/{id}/products', {
    responses: {
      '200': {
        description: 'create a Product model instance',
        content: {'application/json': {schema: getModelSchemaRef(Product)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Order.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProductInOrder',
            exclude: ['id'],
          }),
        },
      },
    })
    product: Omit<Product, 'id'>,
  ): Promise<Product> {
    return this.orderRepository.products(id).create(product);
  }

  @patch('/orders/{id}/products', {
    responses: {
      '200': {
        description: 'Order.Product PATCH success count',
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
    return this.orderRepository.products(id).patch(product, where);
  }

  @del('/orders/{id}/products', {
    responses: {
      '200': {
        description: 'Order.Product DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Product))
    where?: Where<Product>,
  ): Promise<Count> {
    return this.orderRepository.products(id).delete(where);
  }
}
