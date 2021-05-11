import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Shops} from '.';
import {UserCredentials} from './user-credentials.model';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    generated: true,
    id: true,
  })
  id: string;

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
  img?: string;

  @property({
    type: 'string',
    nullable: false,
  })
  role: string;

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  @hasMany(() => Shops)
  shops: Shops[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
