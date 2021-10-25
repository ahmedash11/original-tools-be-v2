import {Filter, repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Product} from '../../models';
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
}
