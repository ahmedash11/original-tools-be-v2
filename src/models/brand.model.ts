import {Entity, hasMany, model, property} from '@loopback/repository';
import {Product} from './product.model';

@model()
export class Brand extends Entity {
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
  description?: string;

  @property({
    type: 'string',
  })
  img?: string;

  @property({
    type: 'number',
  })
  order: number;

  @property({
    type: 'boolean',
    default: true,
  })
  active?: boolean;

  @hasMany(() => Product)
  products: Product[];

  constructor(data?: Partial<Brand>) {
    super(data);
  }
}

export interface BrandRelations {
  // describe navigational properties here
}

export type BrandWithRelations = Brand & BrandRelations;
