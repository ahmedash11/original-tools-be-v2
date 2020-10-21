import {lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  BrandRepository,
  CategoryRepository,
  ProductRepository,
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
    @repository('BrandRepository') private brandRepo: BrandRepository,
    @repository('CategoryRepository') private categoryRepo: CategoryRepository,
    @repository('ProductRepository') private productRepo: ProductRepository,
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    // const brands = Brands.map(
    //   x =>
    //     new Brand({
    //       title: x.title,
    //       img: x.image,
    //       order: x.order,
    //     }),
    // );
    // const categories = Categories.map(
    //   x =>
    //     new Category({
    //       title: x.title,
    //       parentId: x.parentId,
    //       img: x.img,
    //     }),
    // );
    // const products = Products.map(
    //   x =>
    //     new Product({
    //       title: x.title,
    //       description: x.description,
    //       img: x.img,
    //       price: x.price,
    //       cost: x.cost,
    //       quantity: x.quantity,
    //       categoryId: x.categoryId,
    //       brandId: x.brandId,
    //       model: x.model,
    //       views: x.views,
    //     }),
    // );
    // try {
    //   this.brandRepo.createAll(brands);
    //   this.categoryRepo.createAll(categories);
    //   this.productRepo.createAll(products);
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
