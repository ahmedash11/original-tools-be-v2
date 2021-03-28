import {Entity, hasMany, model, property} from '@loopback/repository';
import {Shop} from './marketPlace/shop.model';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    generated: true,
    id: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
    index: {
      unique: true,
    },
  })
  email?: string;

  @property({
    type: 'string',
  })
  password?: string;

  @property({
    type: 'string',
  })
  img?: string;

  @hasMany(() => Shop)
  Shop: Shop[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
