import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Shops, ShopsRelations, Product, ProductShop} from '../models';
import {ProductRepository} from './product.repository';
import {ProductShopRepository} from './product-shop.repository';

export class ShopsRepository extends DefaultCrudRepository<
  Shops,
  typeof Shops.prototype.id,
  ShopsRelations
> {

  public readonly products: HasManyThroughRepositoryFactory<Product, typeof Product.prototype.id,
          ProductShop,
          typeof Shops.prototype.id
        >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProductRepository')
    protected productRepositoryGetter: Getter<ProductRepository>, @repository.getter('ProductShopRepository') protected productShopRepositoryGetter: Getter<ProductShopRepository>,
  ) {
    super(Shops, dataSource);
    this.products = this.createHasManyThroughRepositoryFactoryFor('products', productRepositoryGetter, productShopRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
