import {belongsTo, Entity, model, property} from '@loopback/repository';
import {City} from './city.model';

@model({
  settings: {
    fk_area_cityId: {
      name: 'fk_area_cityId',
      entity: 'City',
      entityKey: 'id',
      foreignKey: 'cityId',
      onDelete: 'restrict',
    },
  },
})
export class Area extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @belongsTo(() => City)
  cityId: number;

  constructor(data?: Partial<Area>) {
    super(data);
  }
}

export interface AreaRelations {
  // describe navigational properties here
}

export type AreaWithRelations = Area & AreaRelations;
