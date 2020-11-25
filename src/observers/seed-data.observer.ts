import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {
  DefaultTransactionalRepository,
  IsolationLevel,
  repository,
} from '@loopback/repository';
import {genSalt, hash} from 'bcryptjs';
import {DbDataSource} from '../datasources';
import {Brands, Categories, Products, ProductTags, Tags} from '../json';
import {Brand, Category, Product, ProductTag, Tag, User} from '../models';
import {
  BrandRepository,
  CategoryRepository,
  ProductRepository,
  ProductTagRepository,
  SectionRepository,
  TagRepository,
  UserRepository,
} from '../repositories';
/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */

@lifeCycleObserver('SeedDataGroup')
export class SeedDataObserver implements LifeCycleObserver {
  /*
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
  ) {}
  */
  constructor(
    @inject('datasources.db') private dataSource: DbDataSource,
    @repository('BrandRepository') private brandRepo: BrandRepository,
    @repository('CategoryRepository') private categoryRepo: CategoryRepository,
    @repository('ProductRepository') private productRepo: ProductRepository,
    @repository('SectionRepository') private sectionRepo: SectionRepository,
    @repository('UserRepository') private userRepo: UserRepository,
    @repository('ProductTagRepository')
    private productTagRepo: ProductTagRepository,

    @repository('TagRepository') private tagRepo: TagRepository,
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    const repo = new DefaultTransactionalRepository(Category, this.dataSource);
    // Now we have a transaction (tx)
    const tx = await repo.beginTransaction(IsolationLevel.READ_COMMITTED);

    try {
      const brands = Brands.map(
        x =>
          new Brand({
            id: x.id,
            title: x.title,
            img: x.img,
            order: x.order,
            slug: x.slug,
          }),
      );
      const categories = Categories.map(
        x =>
          new Category({
            id: x.id,
            title: x.title,
            slug: x.slug,
            parentId: x.parentId == null ? undefined : x.parentId,
            img: x.img,
          }),
      );
      const products = Products.map(
        x =>
          new Product({
            id: x.id,
            title: x.title,
            description: x.description,
            img: x.img,
            price: x.price,
            techInfo: x.techInfo,
            content: x.content,
            slug: x.slug,
            url: x.url,
            addings: x.addings,
            cost: x.cost,
            quantity: x.quantity,
            categoryId: x.categoryId,
            brandId: x.brandId,
            model: x.model,
            views: x.views,
          }),
      );
      const tags = Tags.map(
        x =>
          new Tag({
            id: x.id,
            title: x.title,
            slug: x.slug,
            active: true,
          }),
      );
      const productTags = ProductTags.map(
        x =>
          new ProductTag({
            id: x.id,
            productId: x.productId,
            tagId: x.tagId,
          }),
      );
      const admin = new User({
        name: 'Ibrahim Rashad',
        email: 'ibrahim@etools.com',
        password: await hash('test1234', await genSalt()),
      });
      // await this.userRepo.createAll([admin], {transaction: tx});
      // await this.brandRepo.createAll(brands, {transaction: tx});
      // await this.sectionRepo.createAll(Sections, {transaction: tx});
      // await this.tagRepo.createAll(tags, {transaction: tx});

      // await this.categoryRepo.createAll(categories, {transaction: tx});
      // await this.productRepo.createAll(products, {transaction: tx});
      // await this.productTagRepo.createAll(productTags, {transaction: tx});
      await tx.commit();
    } catch (err) {
      console.log(err);
      await tx.rollback();
    }

    // try {
    //

    // } catch (err) {
    //   console.log(err);
    // }
    // Add your logic for start
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }
}
