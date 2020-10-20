import {Entity, model, property} from '@loopback/repository';

@model()
export class Type extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  title?: string;

  constructor(data?: Partial<Type>) {
    super(data);
  }
}

export interface TypeRelations {
  // describe navigational properties here
}

export type TypeWithRelations = Type & TypeRelations;
