import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Address} from './address.model';
import {Quotation} from './quotation.model';
import {Request} from './request.model';
import {Order} from './order.model';
import {OrderProduct} from './order-product.model';

@model()
export class Customer extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
  })
  company?: string;

  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'string',
  })
  password?: string;

  @property({
    type: 'string',
  })
  mobile: string;

  @hasMany(() => Quotation)
  quotations: Quotation[];

  @hasMany(() => Request)
  requests: Request[];

  @hasOne(() => Address)
  address: Address;

  @hasMany(() => Order, {through: {model: () => OrderProduct}})
  orders: Order[];

  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
  // describe navigational properties here
}

export type CustomerWithRelations = Customer & CustomerRelations;
