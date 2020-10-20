import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Brand, Category, Product, ProductRelations} from '../models';
import {BrandRepository} from './brand.repository';
import {CategoryRepository} from './category.repository';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {
  public readonly brand: BelongsToAccessor<Brand, typeof Product.prototype.id>;

  public readonly category: BelongsToAccessor<
    Category,
    typeof Product.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('BrandRepository')
    protected brandRepositoryGetter: Getter<BrandRepository>,
    @repository.getter('CategoryRepository')
    protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Product, dataSource);
    this.category = this.createBelongsToAccessorFor(
      'category',
      categoryRepositoryGetter,
    );
    this.registerInclusionResolver('category', this.category.inclusionResolver);
    this.brand = this.createBelongsToAccessorFor(
      'brand',
      brandRepositoryGetter,
    );
    this.registerInclusionResolver('brand', this.brand.inclusionResolver);
  }
}
