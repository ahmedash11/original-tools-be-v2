// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {Product, Shops} from '../../models';
import {ShopsRepository, UserRepository} from '../../repositories';

export class AnyController {
  constructor(
    @repository(ShopsRepository) protected shopsRepository: ShopsRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @get('/shop/{id}/products', {
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
  async find(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Product>,
  ): Promise<Product[]> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const shop = await this.shopsRepository.findOne({
      where: {
        id: id,
      },
    });
    if (shop?.userId == userId) {
      return shop
        ? await this.shopsRepository.products(shop.id).find(filter)
        : [];
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
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

  @post('/shop/{id}/products', {
    responses: {
      '200': {
        description: 'create a Product model instance',
        content: {'application/json': {schema: getModelSchemaRef(Product)}},
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
          schema: getModelSchemaRef(Product, {
            title: 'NewProductInShops',
            exclude: ['id'],
          }),
        },
      },
    })
    product: Omit<Product, 'id'>,
  ): Promise<Product> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const shop = await this.shopsRepository.findOne({
      where: {
        id: id,
      },
    });
    if (shop?.userId == userId) {
      return this.shopsRepository.products(id).create(product);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @post('/shopproducts', {
    responses: {
      '200': {
        description: 'create a Product model instance',
        content: {'application/json': {schema: getModelSchemaRef(Product)}},
      },
    },
  })
  @authenticate('jwt')
  async createShopProducts(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.query.object('filter') filterShop: Filter<Shops>,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProductInShops',
            exclude: ['id'],
          }),
        },
      },
    })
    product: Omit<Product, 'id'>,
  ): Promise<Product> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const ShopId = (
      await this.userRepository.shops(userId).find(filterShop)
    ).shift()?.id;
    let shopId = ShopId!;
    let postShopProducts = this.shopsRepository
      .products(shopId)
      .create(product);
    if (userId) {
      return postShopProducts;
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }
}
