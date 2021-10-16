import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {
  Brand,
  Category,
  Product,
  ProductRelations,
  ProductTag,
  ProductType,
  Tag,
  Type, Shops, ProductShop} from '../models';
import {BrandRepository} from './brand.repository';
import {CategoryRepository} from './category.repository';
import {ProductTagRepository} from './product-tag.repository';
import {ProductTypeRepository} from './product-type.repository';
import {TagRepository} from './tag.repository';
import {TypeRepository} from './type.repository';
import {ProductShopRepository} from './product-shop.repository';
import {ShopsRepository} from './shops.repository';

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

  public readonly tags: HasManyThroughRepositoryFactory<
    Tag,
    typeof Tag.prototype.id,
    ProductTag,
    typeof Product.prototype.id
  >;

  public readonly types: HasManyThroughRepositoryFactory<
    Type,
    typeof Type.prototype.id,
    ProductType,
    typeof Product.prototype.id
  >;

  public readonly shops: HasManyThroughRepositoryFactory<Shops, typeof Shops.prototype.id,
          ProductShop,
          typeof Product.prototype.id
        >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,

    @repository.getter('BrandRepository')
    protected brandRepositoryGetter: Getter<BrandRepository>,

    @repository.getter('CategoryRepository')
    protected categoryRepositoryGetter: Getter<CategoryRepository>,

    @repository.getter('ProductTagRepository')
    protected productTagRepositoryGetter: Getter<ProductTagRepository>,

    @repository.getter('TagRepository')
    protected tagRepositoryGetter: Getter<TagRepository>,

    @repository.getter('ProductTypeRepository')
    protected productTypeRepositoryGetter: Getter<ProductTypeRepository>,

    @repository.getter('TypeRepository')
    protected typeRepositoryGetter: Getter<TypeRepository>, @repository.getter('ProductShopRepository') protected productShopRepositoryGetter: Getter<ProductShopRepository>, @repository.getter('ShopsRepository') protected shopsRepositoryGetter: Getter<ShopsRepository>,
  ) {
    super(Product, dataSource);
    this.shops = this.createHasManyThroughRepositoryFactoryFor('shops', shopsRepositoryGetter, productShopRepositoryGetter,);
    this.registerInclusionResolver('shops', this.shops.inclusionResolver);

    this.types = this.createHasManyThroughRepositoryFactoryFor(
      'types',
      typeRepositoryGetter,
      productTypeRepositoryGetter,
    );
    this.registerInclusionResolver('types', this.types.inclusionResolver);

    this.tags = this.createHasManyThroughRepositoryFactoryFor(
      'tags',
      tagRepositoryGetter,
      productTagRepositoryGetter,
    );
    this.registerInclusionResolver('tags', this.tags.inclusionResolver);

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
