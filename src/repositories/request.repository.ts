import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Customer, Product, Request, RequestRelations} from '../models';
import {CustomerRepository} from './customer.repository';
import {ProductRepository} from './product.repository';

export class RequestRepository extends DefaultCrudRepository<
  Request,
  typeof Request.prototype.id,
  RequestRelations
> {
  public readonly product: BelongsToAccessor<
    Product,
    typeof Request.prototype.id
  >;

  public readonly customer: BelongsToAccessor<
    Customer,
    typeof Request.prototype.id
  >;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProductRepository')
    protected productRepositoryGetter: Getter<ProductRepository>,
    @repository.getter('CustomerRepository')
    protected customerRepositoryGetter: Getter<CustomerRepository>,
  ) {
    super(Request, dataSource);
    this.product = this.createBelongsToAccessorFor(
      'product',
      productRepositoryGetter,
    );
    this.registerInclusionResolver('product', this.product.inclusionResolver);
    this.customer = this.createBelongsToAccessorFor(
      'customer',
      this.customerRepositoryGetter,
    );
    this.registerInclusionResolver('customer', this.customer.inclusionResolver);
  }
}
