import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Area} from './area.model';
import {City} from './city.model';
import {Customer} from './customer.model';

@model({
  settings: {
    foreignKeys: {
      fk_address_areaId: {
        name: 'fk_address_areaId',
        entity: 'Area',
        entityKey: 'id',
        foreignKey: 'areaId',
        onDelete: 'restrict',
      },
      fk_address_cityId: {
        name: 'fk_address_cityId',
        entity: 'City',
        entityKey: 'id',
        foreignKey: 'cityId',
        onDelete: 'restrict',
      },
      fk_address_customerId: {
        name: 'fk_address_customerId',
        entity: 'Customer',
        entityKey: 'id',
        foreignKey: 'customerId',
        onDelete: 'cascade',
      },
    },
  },
})
export class Address extends Entity {
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
  street: string;

  @property({
    type: 'string',
  })
  building?: string;

  @property({
    type: 'string',
  })
  appartment?: string;

  @property({
    type: 'string',
  })
  floor?: string;

  @belongsTo(() => Area)
  areaId: number;

  @belongsTo(() => City)
  cityId: number;

  @belongsTo(() => Customer)
  customerId: number;

  constructor(data?: Partial<Address>) {
    super(data);
  }
}

export interface AddressRelations {
  // describe navigational properties here
}

export type AddressWithRelations = Address & AddressRelations;
