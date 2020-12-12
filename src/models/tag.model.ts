import {Entity, hasMany, model, property} from '@loopback/repository';
import {ProductTag} from './product-tag.model';
import {Product} from './product.model';

@model()
export class Tag extends Entity {
  @property({
    type: 'number',
    generated: true,
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  title?: string;

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
    type: 'boolean',
  })
  active?: boolean;

  @property({
    type: 'string',
  })
  slug: string;

  @hasMany(() => Product, {through: {model: () => ProductTag}})
  products: Product[];

  constructor(data?: Partial<Tag>) {
    super(data);
  }
}

export interface TagRelations {
  // describe navigational properties here
}

export type TagWithRelations = Tag & TagRelations;
