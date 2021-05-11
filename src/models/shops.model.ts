import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {ProductShop} from './product-shop.model';
import {Product} from './product.model';
import {User} from './user.model';

@model({
  settings: {
    foreignKeys: {
      fk_shop_userId: {
        name: 'fk_shop_userId',
        entity: 'User',
        entityKey: 'id',
        foreignKey: 'userId',
        onDelete: 'restrict',
      },
    },
  },
})
export class Shops extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
  })
  Img?: string;

  @property({
    type: 'string',
  })
  slug: string;

  @belongsTo(() => User)
  userId: number;

  @hasMany(() => Product, {
    through: {
      model: () => ProductShop,
      keyFrom: 'shopId',
      keyTo: 'productId',
    },
  })
  products: Product[];

  constructor(data?: Partial<Shops>) {
    super(data);
  }
}

export interface ShopsRelations {
  // describe navigational properties here
}

export type ShopsWithRelations = Shops & ShopsRelations;
