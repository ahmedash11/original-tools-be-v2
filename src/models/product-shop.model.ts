import {Entity, model, property} from '@loopback/repository';

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
  })
  productId?: number;

  @property({
    type: 'number',
  })
  shopId?: number;

  @property({
    type: 'number',
  })
  price?: number;

  @property({
    type: 'boolean',
  })
  available?: boolean;

  constructor(data?: Partial<ProductShop>) {
    super(data);
  }
}

export interface ProductShopRelations {
  // describe navigational properties here
}

export type ProductShopWithRelations = ProductShop & ProductShopRelations;
