import {Entity, hasMany, model, property} from '@loopback/repository';
import {Category} from './category.model';

@model()
export class Section extends Entity {
  @property({
    type: 'number',
    generated: true,
    id: true,
  })
  id?: number;

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
  slug?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  active?: boolean;

  @hasMany(() => Category)
  categories: Category[];

  constructor(data?: Partial<Section>) {
    super(data);
  }
}

export interface SectionRelations {
  // describe navigational properties here
}

export type SectionWithRelations = Section & SectionRelations;
