import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Product} from './product.model';
import {Section} from './section.model';

@model({
  settings: {
    foreignKeys: {
      fk_category_parentId: {
        name: 'fk_category_parentId',
        entity: 'Category',
        entityKey: 'id',
        foreignKey: 'parentId',
        onDelete: 'cascade',
      },
      fk_category_sectionId: {
        name: 'fk_category_sectionId',
        entity: 'Section',
        entityKey: 'id',
        foreignKey: 'sectionId',
        onDelete: 'restrict',
      },
    },
  },
})
export class Category extends Entity {
  @property({
    type: 'number',
    generated: true,
    id: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  title: string;

  @property({
    type: 'string',
  })
  metaTitle?: string;

  @property({
    type: 'string',
    mysql: {
      dataType: 'LONGTEXT',
    },
  })
  metaDescription?: string;

  @property({
    type: 'string',
  })
  slug: string;

  @property({
    type: 'string',
  })
  img?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  active?: boolean;

  @property({
    type: 'number',
    default: 0,
  })
  order: string;

  @hasMany(() => Product)
  products: Product[];

  @belongsTo(() => Category)
  parentId?: number;

  @hasMany(() => Category, {keyTo: 'parentId'})
  subcategories: Category[];

  @belongsTo(() => Section)
  sectionId?: number;

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
