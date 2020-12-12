import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {City, CityRelations, Area} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {AreaRepository} from './area.repository';

export class CityRepository extends DefaultCrudRepository<
  City,
  typeof City.prototype.id,
  CityRelations
> {

  public readonly areas: HasManyRepositoryFactory<Area, typeof City.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('AreaRepository') protected areaRepositoryGetter: Getter<AreaRepository>,
  ) {
    super(City, dataSource);
    this.areas = this.createHasManyRepositoryFactoryFor('areas', areaRepositoryGetter,);
    this.registerInclusionResolver('areas', this.areas.inclusionResolver);
  }
}
