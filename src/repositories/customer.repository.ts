import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository, HasOneRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {
  Customer,
  CustomerRelations,
  Order,
  Quotation,
  Request, Address} from '../models';
import {OrderRepository} from './order.repository';
import {QuotationRepository} from './quotation.repository';
import {RequestRepository} from './request.repository';
import {AddressRepository} from './address.repository';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
> {
  public readonly orders: HasManyRepositoryFactory<
    Order,
    typeof Customer.prototype.id
  >;

  public readonly quotations: HasManyRepositoryFactory<
    Quotation,
    typeof Customer.prototype.id
  >;

  public readonly requests: HasManyRepositoryFactory<
    Request,
    typeof Customer.prototype.id
  >;

  public readonly address: HasOneRepositoryFactory<Address, typeof Customer.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('OrderRepository')
    protected orderRepositoryGetter: Getter<OrderRepository>,
    @repository.getter('QuotationRepository')
    protected quotationRepositoryGetter: Getter<QuotationRepository>,
    @repository.getter('RequestRepository')
    protected requestRepositoryGetter: Getter<RequestRepository>, @repository.getter('AddressRepository') protected addressRepositoryGetter: Getter<AddressRepository>,
  ) {
    super(Customer, dataSource);
    this.address = this.createHasOneRepositoryFactoryFor('address', addressRepositoryGetter);
    this.registerInclusionResolver('address', this.address.inclusionResolver);
    this.requests = this.createHasManyRepositoryFactoryFor(
      'requests',
      requestRepositoryGetter,
    );
    this.registerInclusionResolver('requests', this.requests.inclusionResolver);
    this.quotations = this.createHasManyRepositoryFactoryFor(
      'quotations',
      quotationRepositoryGetter,
    );
    this.registerInclusionResolver(
      'quotations',
      this.quotations.inclusionResolver,
    );
    this.orders = this.createHasManyRepositoryFactoryFor(
      'orders',
      orderRepositoryGetter,
    );
    this.registerInclusionResolver('orders', this.orders.inclusionResolver);
  }
}
