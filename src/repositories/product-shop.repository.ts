import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {ProductShop, ProductShopRelations} from '../models';

export class ProductShopRepository extends DefaultCrudRepository<
  ProductShop,
  typeof ProductShop.prototype.id,
  ProductShopRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(ProductShop, dataSource);
  }
}
