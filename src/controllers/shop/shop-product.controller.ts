// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {Product, ProductShop, Shops} from '../../models';
import {ShopsRepository, UserRepository} from '../../repositories';

export class ShopProductContoller {
  constructor(
    @repository(ShopsRepository) protected shopsRepository: ShopsRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @get('/shop/{id}/products', {
    responses: {
      '200': {
        description: 'Array of Shops has many ProductShop',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProductShop)},
          },
        },
      },
    },
  })
  async find(@param.path.number('id') id: number) {
    const shop = await this.shopsRepository.findById(id);
    const productshop = await this.shopsRepository
      .productShops(id)
      .find({include: [{relation: 'product'}]});
    return [shop, productshop];
  }

  @get('/shopproducts', {
    responses: {
      '200': {
        description: 'Array of Shops has many Product through ProductShop',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async findproducts(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.query.object('filter') filter?: Filter<Product>,
    @param.query.object('filter') filterShop?: Filter<Shops>,
  ): Promise<Product[]> {
    // current user to ensure just the owner have acsess here
    const userId = await currentUserProfile[securityId];
    const ShopId = await (
      await this.userRepository.shops(userId).find(filterShop)
    ).shift()?.id;
    let shopId = ShopId!;
    let getShopProducts = this.shopsRepository.products(shopId).find(filter);
    if (userId) {
      return await getShopProducts;
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @get('/shopproducts/count', {
    responses: {
      '200': {
        description: 'ShopProduct model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async count(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.query.object('filter') filterShop?: Filter<Shops>,
  ): Promise<any> {
    // current user to ensure just the owner have acsess here
    const userId = await currentUserProfile[securityId];
    const ShopId = await (
      await this.userRepository.shops(userId).find(filterShop)
    ).shift()?.id;
    let shopId = ShopId!;
    let productsCount = await this.shopsRepository
      .products(shopId)
      .find({offset: 5, limit: 10});
    return productsCount;
  }
  @post('/shop/{id}/products', {
    responses: {
      '200': {
        description: 'Shops model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProductShop)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.number('id') id: typeof Shops.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductShop, {
            title: 'NewProductShopInShops',
            exclude: ['id'],
            optional: ['shopId'],
          }),
        },
      },
    })
    productShop: Omit<ProductShop, 'id'>,
  ): Promise<ProductShop> {
    // current user to ensure just the owner have acsess here
    const userId = await currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      return this.shopsRepository.productShops(id).create(productShop);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @patch('/shop/{id}/products', {
    responses: {
      '200': {
        description: 'Shops.ProductShop PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async patch(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductShop, {partial: true}),
        },
      },
    })
    productShop: Partial<ProductShop>,
    @param.query.object('where', getWhereSchemaFor(ProductShop))
    where?: Where<ProductShop>,
  ): Promise<Count> {
    // current user to ensure just the owner have acsess here
    const userId = await currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      return this.shopsRepository.productShops(id).patch(productShop, where);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @patch('/shopproducts/{id}', {
    responses: {
      '200': {
        description: 'edit a shopproducts model instance',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async editShopProducts(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
    product: Partial<Product>,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    // @param.query.object('where', getWhereSchemaFor(Product))
    // where?: Where<Product>,
    @param.path.number('id') id: number,
    @param.query.object('filter') filterShop?: Filter<Shops>,
  ): Promise<Count> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const ShopId = (
      await this.userRepository.shops(userId).find(filterShop)
    ).shift()?.id;
    let shopId = ShopId!;
    let editShopProducts = this.shopsRepository
      .products(shopId)
      .patch(product, {id: id});
    if (userId) {
      return editShopProducts;
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @del('/shop/{id}/products', {
    responses: {
      '200': {
        description: 'Shops.ProductShop DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async delete(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ProductShop))
    where?: Where<ProductShop>,
  ): Promise<Count> {
    // current user to ensure just the owner have acsess here
    const userId = await currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      return this.shopsRepository.productShops(id).delete(where);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @del('/shopproducts/{id}', {
    responses: {
      '204': {
        description: 'delete a shopproducts model instance',
        // content: {'application/json': {schema: getModelSchemaRef(Product)}},
      },
    },
  })
  @authenticate('jwt')
  async delShopProducts(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.number('id') id: number,
    @param.query.object('filter') filterShop: Filter<Shops>,
  ): Promise<Count> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const ShopId = (
      await this.userRepository.shops(userId).find(filterShop)
    ).shift()?.id;
    let shopId = ShopId!;
    let delShopProducts = this.shopsRepository
      .products(shopId)
      .delete({id: id});
    if (userId) {
      return delShopProducts;
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }
}
