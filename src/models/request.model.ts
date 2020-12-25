import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Customer} from './customer.model';
import {Product} from './product.model';

@model({
  settings: {
    fk_request_customerId: {
      name: 'fk_request_customerId',
      entity: 'Customer',
      entityKey: 'id',
      foreignKey: 'customerId',
      onDelete: 'cascade',
    },
  },
})
export class Request extends Entity {
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'string',
  })
  mobile: string;

  @belongsTo(() => Product)
  productId: number;

  @belongsTo(() => Customer)
  customerId?: number;

  constructor(data?: Partial<Request>) {
    super(data);
  }
}

export interface RequestRelations {
  // describe navigational properties here
}

export type RequestWithRelations = Request & RequestRelations;
