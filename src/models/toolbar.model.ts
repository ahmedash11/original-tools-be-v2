import {Entity, model, property} from '@loopback/repository';

@model()
export class Toolbar extends Entity {
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

  @property({
    type: 'string',
    required: true,
  })
  link: string;

  @property({
    type: 'number',
  })
  order?: number;

  constructor(data?: Partial<Toolbar>) {
    super(data);
  }
}

export interface ToolbarRelations {
  // describe navigational properties here
}

export type ToolbarWithRelations = Toolbar & ToolbarRelations;
