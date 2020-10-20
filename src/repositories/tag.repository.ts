import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Product, ProductTag, Tag, TagRelations} from '../models';
import {ProductTagRepository} from './product-tag.repository';
import {ProductRepository} from './product.repository';

export class TagRepository extends DefaultCrudRepository<
  Tag,
  typeof Tag.prototype.id,
  TagRelations
> {
  public readonly products: HasManyThroughRepositoryFactory<
    Product,
    typeof Product.prototype.id,
    ProductTag,
    typeof Product.prototype.id
  >;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProductTagRepository')
    protected productTagRepositoryGetter: Getter<ProductTagRepository>,

    @repository.getter('ProductRepository')
    protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Tag, dataSource);

    this.products = this.createHasManyThroughRepositoryFactoryFor(
      'products',
      productRepositoryGetter,
      productTagRepositoryGetter,
    );
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
