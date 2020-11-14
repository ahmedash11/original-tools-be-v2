import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    foreignKeys: {
      fk_product_tagId: {
        name: 'fk_product_tagId',
        entity: 'Tag',
        entityKey: 'id',
        foreignKey: 'tagId',
        onDelete: 'cascade',
      },
      fk_tag_productId: {
        name: 'fk_tag_productId',
        entity: 'Product',
        entityKey: 'id',
        foreignKey: 'productId',
        onDelete: 'cascade',
      },
    },
  },
})
export class ProductTag extends Entity {
  @property({
    type: 'number',
    generated: true,
    id: true,
  })
  id: number;

  @property({
    type: 'number',
  })
  productId: number;

  @property({
    type: 'number',
  })
  tagId: number;

  constructor(data?: Partial<ProductTag>) {
    super(data);
  }
}

export interface ProductTagRelations {
  // describe navigational properties here
}

export type ProductTagWithRelations = ProductTag & ProductTagRelations;
