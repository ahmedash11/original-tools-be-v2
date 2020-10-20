import {DefaultCrudRepository} from '@loopback/repository';
import {ProductType, ProductTypeRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ProductTypeRepository extends DefaultCrudRepository<
  ProductType,
  typeof ProductType.prototype.id,
  ProductTypeRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ProductType, dataSource);
  }
}
