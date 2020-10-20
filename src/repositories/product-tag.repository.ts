import {DefaultCrudRepository} from '@loopback/repository';
import {ProductTag, ProductTagRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ProductTagRepository extends DefaultCrudRepository<
  ProductTag,
  typeof ProductTag.prototype.id,
  ProductTagRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ProductTag, dataSource);
  }
}
