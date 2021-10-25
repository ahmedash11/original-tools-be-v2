import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Product, ProductShop, Shops, ShopsRelations, User} from '../models';
import {ProductShopRepository} from './product-shop.repository';
import {ProductRepository} from './product.repository';
import {UserRepository} from './user.repository';

export class ShopsRepository extends DefaultCrudRepository<
  Shops,
  typeof Shops.prototype.id,
  ShopsRelations
> {
  public readonly products: HasManyThroughRepositoryFactory<
    Product,
    typeof Product.prototype.id,
    ProductShop,
    typeof Shops.prototype.id
  >;

  public readonly user: BelongsToAccessor<User, typeof Shops.prototype.id>;

  public readonly productShops: HasManyRepositoryFactory<
    ProductShop,
    typeof Shops.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProductRepository')
    protected productRepositoryGetter: Getter<ProductRepository>,
    @repository.getter('ProductShopRepository')
    protected productShopRepositoryGetter: Getter<ProductShopRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Shops, dataSource);
    this.productShops = this.createHasManyRepositoryFactoryFor(
      'productShops',
      productShopRepositoryGetter,
    );
    this.registerInclusionResolver(
      'productShops',
      this.productShops.inclusionResolver,
    );
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.products = this.createHasManyThroughRepositoryFactoryFor(
      'products',
      productRepositoryGetter,
      productShopRepositoryGetter,
    );
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
