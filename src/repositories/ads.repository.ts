import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Ads, AdsRelations} from '../models';

export class AdsRepository extends DefaultCrudRepository<
  Ads,
  typeof Ads.prototype.id,
  AdsRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Ads, dataSource);
  }
}
