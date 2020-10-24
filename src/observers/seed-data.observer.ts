import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {
  DefaultTransactionalRepository,
  IsolationLevel,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import Brands from '../json/brands.json';
import Categories from '../json/categories.json';
import Products from '../json/products.json';
import ProductTags from '../json/productTags.json';
import Tags from '../json/tags.json';
import {Brand, Category, Product, ProductTag, Tag} from '../models';
import {
  BrandRepository,
  CategoryRepository,
  ProductRepository,
  ProductTagRepository,
  TagRepository,
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
            img: x.image,
            order: x.order,
          }),
      );
      const categories = Categories.map(
        x =>
          new Category({
            id: x.id,
            title: x.title,
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
      // await this.brandRepo.createAll(brands, {transaction: tx});
      // await this.categoryRepo.createAll(categories, {transaction: tx});
      // await this.tagRepo.createAll(tags, {transaction: tx});
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
