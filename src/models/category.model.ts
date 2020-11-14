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
      },
      fk_category_sectionId: {
        name: 'fk_category_sectionId',
        entity: 'Section',
        entityKey: 'id',
        foreignKey: 'sectionId',
      },
    },
  },
})
export class Category extends Entity {
  @property({
    type: 'number',
    id: true,
    // generated: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  title: string;

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

  @hasMany(() => Product)
  products: Product[];

  @belongsTo(() => Category)
  parentId?: number;

  @hasMany(() => Category, {keyTo: 'parentId'})
  categories: Category[];

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
