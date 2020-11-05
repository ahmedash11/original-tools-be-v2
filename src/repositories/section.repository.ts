import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Section, SectionRelations, Category} from '../models';
import {Error: bad inputDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CategoryRepository} from './category.repository';

export class SectionRepository extends DefaultCrudRepository<
  Section,
  typeof Section.prototype.id,
  SectionRelations
> {

  public readonly categories: HasManyRepositoryFactory<Category, typeof Section.prototype.id>;

  constructor(
    @inject('datasources.') dataSource: Error: bad inputDataSource, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Section, dataSource);
    this.categories = this.createHasManyRepositoryFactoryFor('categories', categoryRepositoryGetter,);
    this.registerInclusionResolver('categories', this.categories.inclusionResolver);
  }
}
