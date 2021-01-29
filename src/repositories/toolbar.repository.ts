import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Toolbar, ToolbarRelations} from '../models';

export class ToolbarRepository extends DefaultCrudRepository<
  Toolbar,
  typeof Toolbar.prototype.id,
  ToolbarRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Toolbar, dataSource);
  }
}
