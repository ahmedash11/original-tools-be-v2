import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Product} from './product.model';
import {Shops} from './shops.model';

@model({
  settings: {
    foreignKeys: {
      fk_product_shopId: {
        name: 'fk_product_shopId',
        entity: 'Shops',
        entityKey: 'id',
        foreignKey: 'shopId',
        onDelete: 'cascade',
      },
      fk_tag_productId: {
        name: 'fk_shop_productId',
        entity: 'Product',
        entityKey: 'id',
        foreignKey: 'productId',
        onDelete: 'cascade',
      },
    },
  },
})
export class ProductShop extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;
  @property({
    type: 'number',
    default: 0,
  })
  discount?: number;

  @property({
    type: 'number',
  })
  quantity?: number;

  @belongsTo(() => Product)
  productId: number;

  @belongsTo(() => Shops)
  shopId: number;

  constructor(data?: Partial<ProductShop>) {
    super(data);
  }
}

export interface ProductShopRelations {
  // describe navigational properties here
}

export type ProductShopWithRelations = ProductShop & ProductShopRelations;
