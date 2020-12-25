import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Customer} from './customer.model';
import {OrderProduct} from './order-product.model';
import {Product} from './product.model';

@model({
  settings: {
    fk_order_customerId: {
      name: 'fk_order_customerId',
      entity: 'Customer',
      entityKey: 'id',
      foreignKey: 'customerId',
      onDelete: 'cascade',
    },
  },
})
export class Order extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  orderNo?: number;

  @property({
    type: 'string',
  })
  comment?: string;

  @property({
    type: 'string',
    default: 'Pending',
  })
  status?: string;

  @property({
    type: 'number',
    required: true,
  })
  total: number;

  @belongsTo(() => Customer)
  customerId: number;

  @hasMany(() => Product, {through: {model: () => OrderProduct}})
  products: Product[];

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
}

export type OrderWithRelations = Order & OrderRelations;
