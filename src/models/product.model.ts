import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Brand} from './brand.model';
import {Category} from './category.model';
import {ProductTag} from './product-tag.model';
import {ProductType} from './product-type.model';
import {Tag} from './tag.model';
import {Type} from './type.model';

@model({
  settings: {
    foreignKeys: {
      fk_product_brandId: {
        name: 'fk_product_brandId',
        entity: 'Brand',
        entityKey: 'id',
        foreignKey: 'brandId',
        onDelete: 'cascade',
      },
      fk_product_categoryId: {
        name: 'fk_product_categoryId',
        entity: 'Category',
        entityKey: 'id',
        foreignKey: 'categoryId',
        onDelete: 'cascade',
      },
    },
  },
})
export class Product extends Entity {
  @property({
    type: 'number',
    generated: true,
    id: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'string',
    mysql: {
      dataType: 'LONGTEXT',
    },
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

  @property({
    type: 'number',
  })
  price: number;

  @property({
    type: 'number',
    dataType: 'FLOAT',
  })
  cost?: number;

  @property({
    type: 'number',
  })
  quantity: number;

  @property({
    type: 'string',
  })
  model?: string;

  @property({
    type: 'number',
    default: 0,
  })
  views?: number;

  @property({
    type: 'boolean',
    default: false,
  })
  landing?: boolean;

  @property({
    type: 'boolean',
    default: true,
  })
  active?: boolean;

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
