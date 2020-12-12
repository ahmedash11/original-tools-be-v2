import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Address, AddressRelations, Area, City, Customer} from '../models';
import {AreaRepository} from './area.repository';
import {CityRepository} from './city.repository';
import {CustomerRepository} from './customer.repository';

export class AddressRepository extends DefaultCrudRepository<
  Address,
  typeof Address.prototype.id,
  AddressRelations
> {
  public readonly area: BelongsToAccessor<Area, typeof Address.prototype.id>;

  public readonly city: BelongsToAccessor<City, typeof Address.prototype.id>;

  public readonly customer: BelongsToAccessor<
    Customer,
    typeof Address.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('AreaRepository')
    protected areaRepositoryGetter: Getter<AreaRepository>,
    @repository.getter('CityRepository')
    protected cityRepositoryGetter: Getter<CityRepository>,
    @repository.getter('CustomerRepository')
    protected customerRepositoryGetter: Getter<CustomerRepository>,
  ) {
    super(Address, dataSource);
    this.city = this.createBelongsToAccessorFor('city', cityRepositoryGetter);
    this.registerInclusionResolver('city', this.city.inclusionResolver);
    this.area = this.createBelongsToAccessorFor('area', areaRepositoryGetter);
    this.registerInclusionResolver('area', this.area.inclusionResolver);
    this.customer = this.createBelongsToAccessorFor(
      'customer',
      this.customerRepositoryGetter,
    );
    this.registerInclusionResolver('customer', this.customer.inclusionResolver);
  }
}
