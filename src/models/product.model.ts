import {belongsTo, Entity, model, property, hasMany} from '@loopback/repository';
import {Brand} from './brand.model';
import {Category} from './category.model';
import {Tag} from './tag.model';
import {ProductTag} from './product-tag.model';
import {Type} from './type.model';
import {ProductType} from './product-type.model';

@model({
  settings: {
    foreignKeys: {
      fk_product_brandId: {
        name: 'fk_product_brandId',
        entity: 'Brand',
        entityKey: 'id',
        foreignKey: 'brandId',
      },
      fk_product_categoryId: {
        name: 'fk_product_categoryId',
        entity: 'Category',
        entityKey: 'id',
        foreignKey: 'categoryId',
      },
    },
  },
})
export class Product extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  title?: string;

  @belongsTo(() => Brand)
  brandId: number;

  @belongsTo(() => Category)
  categoryId: number;

  @hasMany(() => Tag, {through: {model: () => ProductTag}})
  tags: Tag[];

  @hasMany(() => Type, {through: {model: () => ProductType}})
  types: Type[];

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
