import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Product} from './product.model';

@model({
  settings: {
    foreignKeys: {
      fk_category_parentId: {
        name: 'fk_category_parentId',
        entity: 'Category',
        entityKey: 'id',
        foreignKey: 'parentId',
      },
    },
  },
})
export class Category extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  title: string;

  @property({
    type: 'string',
  })
  img: string;

  @property({
    type: 'boolean',
    default: true,
  })
  active?: boolean;

  @hasMany(() => Product)
  products: Product[];

  @belongsTo(() => Category)
  parentId: number;

  @hasMany(() => Category, {keyTo: 'parentId'})
  categories: Category[];

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
