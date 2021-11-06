import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {OrderProduct, OrderProductRelations, Product, Shops, Order, Customer} from '../models';
import {ProductRepository} from './product.repository';
import {ShopsRepository} from './shops.repository';
import {OrderRepository} from './order.repository';
import {CustomerRepository} from './customer.repository';

export class OrderProductRepository extends DefaultCrudRepository<
  OrderProduct,
  typeof OrderProduct.prototype.id,
  OrderProductRelations
> {

  public readonly product: BelongsToAccessor<Product, typeof OrderProduct.prototype.id>;

  public readonly shop: BelongsToAccessor<Shops, typeof OrderProduct.prototype.id>;

  public readonly order: BelongsToAccessor<Order, typeof OrderProduct.prototype.id>;

  public readonly customer: BelongsToAccessor<Customer, typeof OrderProduct.prototype.id>;

  constructor(@inject('datasources.db') dataSource: DbDataSource, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>, @repository.getter('ShopsRepository') protected shopsRepositoryGetter: Getter<ShopsRepository>, @repository.getter('OrderRepository') protected orderRepositoryGetter: Getter<OrderRepository>, @repository.getter('CustomerRepository') protected customerRepositoryGetter: Getter<CustomerRepository>,) {
    super(OrderProduct, dataSource);
    this.customer = this.createBelongsToAccessorFor('customer', customerRepositoryGetter,);
    this.registerInclusionResolver('customer', this.customer.inclusionResolver);
    this.order = this.createBelongsToAccessorFor('order', orderRepositoryGetter,);
    this.registerInclusionResolver('order', this.order.inclusionResolver);
    this.shop = this.createBelongsToAccessorFor('shop', shopsRepositoryGetter,);
    this.registerInclusionResolver('shop', this.shop.inclusionResolver);
    this.product = this.createBelongsToAccessorFor('product', productRepositoryGetter,);
    this.registerInclusionResolver('product', this.product.inclusionResolver);
  }
}
