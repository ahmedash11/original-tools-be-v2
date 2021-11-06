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
import {Order} from './order.model';
import {OrderProduct} from './order-product.model';

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
  img?: string;

  @property({
    type: 'string',
  })
  slug: string;

  @hasMany(() => Product, {
    through: {
      model: () => ProductShop,
      keyFrom: 'shopId',
      keyTo: 'productId',
    },
  })
  products: Product[];

  @belongsTo(() => User)
  userId: number;

  @hasMany(() => ProductShop, {keyTo: 'shopId'})
  productShops: ProductShop[];

  @hasMany(() => Order, {through: {model: () => OrderProduct, keyFrom: 'shopId'}})
  orders: Order[];

  constructor(data?: Partial<Shops>) {
    super(data);
  }
}

export interface ShopsRelations {
  // describe navigational properties here
}

export type ShopsWithRelations = Shops & ShopsRelations;
