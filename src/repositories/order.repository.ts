import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {
  Customer,
  Order,
  OrderProduct,
  OrderRelations,
  Product,
} from '../models';
import {CustomerRepository} from './customer.repository';
import {OrderProductRepository} from './order-product.repository';
import {ProductRepository} from './product.repository';

export class OrderRepository extends DefaultCrudRepository<
  Order,
  typeof Order.prototype.id,
  OrderRelations
> {
  public readonly products: HasManyThroughRepositoryFactory<
    Product,
    typeof Product.prototype.id,
    OrderProduct,
    typeof Order.prototype.id
  >;
  public readonly customer: BelongsToAccessor<
    Customer,
    typeof Order.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('OrderProductRepository')
    protected orderProductRepositoryGetter: Getter<OrderProductRepository>,
    @repository.getter('ProductRepository')
    protected productRepositoryGetter: Getter<ProductRepository>,
    @repository.getter('CustomerRepository')
    protected customerRepositoryGetter: Getter<CustomerRepository>,
  ) {
    super(Order, dataSource);
    this.products = this.createHasManyThroughRepositoryFactoryFor(
      'products',
      productRepositoryGetter,
      orderProductRepositoryGetter,
    );
    this.registerInclusionResolver('products', this.products.inclusionResolver);
    this.customer = this.createBelongsToAccessorFor(
      'customer',
      this.customerRepositoryGetter,
    );
    this.registerInclusionResolver('customer', this.customer.inclusionResolver);
  }
}
