import {Entity, model, property} from '@loopback/repository';

@model()
export class Ads extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  title: string;

  @property({
    type: 'string',
  })
  text?: string;

  @property({
    type: 'string',
  })
  desktopImg?: string;

  @property({
    type: 'string',
  })
  mobileImg?: string;

  @property({
    type: 'string',
  })
  link?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  viewButton?: boolean;

  @property({
    type: 'number',
  })
  order?: number;

  constructor(data?: Partial<Ads>) {
    super(data);
  }
}

export interface AdsRelations {
  // describe navigational properties here
}

export type AdsWithRelations = Ads & AdsRelations;
