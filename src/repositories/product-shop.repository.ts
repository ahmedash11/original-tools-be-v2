import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Product, ProductShop, ProductShopRelations, Shops} from '../models';
import {ProductRepository} from './product.repository';
import {ShopsRepository} from './shops.repository';

export class ProductShopRepository extends DefaultCrudRepository<
  ProductShop,
  typeof ProductShop.prototype.id,
  ProductShopRelations
> {
  public readonly product: BelongsToAccessor<
    Product,
    typeof ProductShop.prototype.id
  >;

  public readonly shop: BelongsToAccessor<
    Shops,
    typeof ProductShop.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProductRepository')
    protected productRepositoryGetter: Getter<ProductRepository>,
    @repository.getter('ShopsRepository')
    protected shopsRepositoryGetter: Getter<ShopsRepository>,
  ) {
    super(ProductShop, dataSource);
    this.shop = this.createBelongsToAccessorFor('shop', shopsRepositoryGetter);
    this.registerInclusionResolver('shop', this.shop.inclusionResolver);
    this.product = this.createBelongsToAccessorFor(
      'product',
      productRepositoryGetter,
    );
    this.registerInclusionResolver('product', this.product.inclusionResolver);
  }
}
