import {DefaultCrudRepository} from '@loopback/repository';
import {Type, TypeRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TypeRepository extends DefaultCrudRepository<
  Type,
  typeof Type.prototype.id,
  TypeRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Type, dataSource);
  }
}
