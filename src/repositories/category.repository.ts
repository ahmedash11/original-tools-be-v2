import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Category, CategoryRelations, Product, Section} from '../models';
import {ProductRepository} from './product.repository';
import {SectionRepository} from './section.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {
  public readonly products: HasManyRepositoryFactory<
    Product,
    typeof Category.prototype.id
  >;

  public readonly parent: BelongsToAccessor<
    Category,
    typeof Category.prototype.id
  >;

  public readonly subcategories: HasManyRepositoryFactory<
    Category,
    typeof Category.prototype.id
  >;

  public readonly section: BelongsToAccessor<
    Section,
    typeof Category.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProductRepository')
    protected productRepositoryGetter: Getter<ProductRepository>,
    @repository.getter('CategoryRepository')
    protected categoryRepositoryGetter: Getter<CategoryRepository>,
    @repository.getter('SectionRepository')
    protected sectionRepositoryGetter: Getter<SectionRepository>,
  ) {
    super(Category, dataSource);
    this.section = this.createBelongsToAccessorFor(
      'section',
      sectionRepositoryGetter,
    );
    this.registerInclusionResolver('section', this.section.inclusionResolver);
    this.subcategories = this.createHasManyRepositoryFactoryFor(
      'subcategories',
      Getter.fromValue(this),
    );
    this.registerInclusionResolver(
      'subcategories',
      this.subcategories.inclusionResolver,
    );

    this.parent = this.createBelongsToAccessorFor(
      'parent',
      Getter.fromValue(this),
    );
    this.registerInclusionResolver('parent', this.parent.inclusionResolver);

    this.products = this.createHasManyRepositoryFactoryFor(
      'products',
      productRepositoryGetter,
    );
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
