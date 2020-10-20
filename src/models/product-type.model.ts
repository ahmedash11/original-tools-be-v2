import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    foreignKeys: {
      fk_product_brandId: {
        name: 'fk_product_typeId',
        entity: 'Type',
        entityKey: 'id',
        foreignKey: 'typeId',
      },
      fk_type_productId: {
        name: 'fk_type_productId',
        entity: 'Product',
        entityKey: 'id',
        foreignKey: 'productId',
      },
    },
  },
})
export class ProductType extends Entity {
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
  typeId?: number;

  constructor(data?: Partial<ProductType>) {
    super(data);
  }
}

export interface ProductTypeRelations {
  // describe navigational properties here
}

export type ProductTypeWithRelations = ProductType & ProductTypeRelations;
