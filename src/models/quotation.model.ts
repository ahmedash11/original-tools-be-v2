import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Customer} from './customer.model';

@model({
  settings: {
    fk_quotation_customerId: {
      name: 'fk_quotation_customerId',
      entity: 'Customer',
      entityKey: 'id',
      foreignKey: 'customerId',
      onDelete: 'cascade',
    },
  },
})
export class Quotation extends Entity {
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
  file: string;

  @belongsTo(() => Customer)
  customerId: number;

  constructor(data?: Partial<Quotation>) {
    super(data);
  }
}

export interface QuotationRelations {
  // describe navigational properties here
}

export type QuotationWithRelations = Quotation & QuotationRelations;
