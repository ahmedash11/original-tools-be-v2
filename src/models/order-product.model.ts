import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Product} from './product.model';
import {Shops} from './shops.model';
import {Order} from './order.model';
import {Customer} from './customer.model';

@model({
  settings: {
    foreignKeys: {
      fk_product_orderId: {
        name: 'fk_product_orderId',
        entity: 'Order',
        entityKey: 'id',
        foreignKey: 'orderId',
        onDelete: 'cascade',
      },
      fk_order_productId: {
        name: 'fk_order_productId',
        entity: 'Product',
        entityKey: 'id',
        foreignKey: 'productId',
        onDelete: 'cascade',
      },
    },
  },
})
export class OrderProduct extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;
  @property({
    type: 'number',
    default: 1,
  })
  quantity: number;

  @belongsTo(() => Product)
  productId: number;

  @belongsTo(() => Shops)
  shopId: number;

  @belongsTo(() => Order)
  orderId: number;

  @belongsTo(() => Customer)
  customerId: number;

  constructor(data?: Partial<OrderProduct>) {
    super(data);
  }
}

export interface OrderProductRelations {
  // describe navigational properties here
}

export type OrderProductWithRelations = OrderProduct & OrderProductRelations;
