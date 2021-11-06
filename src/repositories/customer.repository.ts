import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {
  Address,
  Customer,
  CustomerRelations,
  Quotation,
  Request, Order, OrderProduct} from '../models';
import {AddressRepository} from './address.repository';
import {OrderRepository} from './order.repository';
import {QuotationRepository} from './quotation.repository';
import {RequestRepository} from './request.repository';
import {OrderProductRepository} from './order-product.repository';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
> {
  public readonly quotations: HasManyRepositoryFactory<
    Quotation,
    typeof Customer.prototype.id
  >;

  public readonly requests: HasManyRepositoryFactory<
    Request,
    typeof Customer.prototype.id
  >;

  public readonly address: HasOneRepositoryFactory<
    Address,
    typeof Customer.prototype.id
  >;

  public readonly orders: HasManyThroughRepositoryFactory<Order, typeof Order.prototype.id,
          OrderProduct,
          typeof Customer.prototype.id
        >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('OrderRepository')
    protected orderRepositoryGetter: Getter<OrderRepository>,
    @repository.getter('QuotationRepository')
    protected quotationRepositoryGetter: Getter<QuotationRepository>,
    @repository.getter('RequestRepository')
    protected requestRepositoryGetter: Getter<RequestRepository>,
    @repository.getter('AddressRepository')
    protected addressRepositoryGetter: Getter<AddressRepository>, @repository.getter('OrderProductRepository') protected orderProductRepositoryGetter: Getter<OrderProductRepository>,
  ) {
    super(Customer, dataSource);
    this.orders = this.createHasManyThroughRepositoryFactoryFor('orders', orderRepositoryGetter, orderProductRepositoryGetter,);
    this.registerInclusionResolver('orders', this.orders.inclusionResolver);
    this.address = this.createHasOneRepositoryFactoryFor(
      'address',
      addressRepositoryGetter,
    );
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
  }
}
