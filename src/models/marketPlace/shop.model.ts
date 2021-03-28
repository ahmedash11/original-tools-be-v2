import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property
} from '@loopback/repository';
import {Product} from '../product.model';
import {User} from '../user.model';

@model({
  name: 'shops',
})
export class Shop extends Entity {
  @property({
    type: 'number',
    generated: true,
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  shopName?: string;

  @property({
    type: 'string',
    mysql: {
      dataType: 'LONGTEXT',
    },
  })
  shopDescription?: string;

  @property({
    type: 'string',
  })
  shopImg?: string;

  @belongsTo(() => User)
  userId: number;

  @hasMany(() => Product)
  Product: Product[];

  constructor(data?: Partial<Shop>) {
    super(data);
  }
}

export interface ShopRelations {
  // describe navigational properties here
}

export type ShopWithRelations = Shop & ShopRelations;
