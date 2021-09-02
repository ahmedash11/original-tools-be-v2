import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {Shops} from '../../models';
import {ShopsRepository, UserRepository} from '../../repositories';
import {concatSlug} from '../../services';

export class ShopContoller {
  constructor(
    @repository(ShopsRepository)
    public shopsRepository: ShopsRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @post('/shops')
  @response(200, {
    description: 'Shops model instance',
    content: {'application/json': {schema: getModelSchemaRef(Shops)}},
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shops, {
            title: 'NewShops',
            exclude: ['id'],
          }),
        },
      },
    })
    shops: Omit<Shops, 'id'>,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Shops> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      shops.slug = concatSlug([shops.name]);
      return this.shopsRepository.create(shops);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @get('/shops/count')
  @response(200, {
    description: 'Shops model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Shops) where?: Where<Shops>): Promise<Count> {
    return this.shopsRepository.count(where);
  }

  @get('/shops')
  @response(200, {
    description: 'Array of Shops model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Shops, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Shops) filter?: Filter<Shops>): Promise<Shops[]> {
    return this.shopsRepository.find(filter);
  }

  @patch('/shops')
  @response(200, {
    description: 'Shops PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shops, {partial: true}),
        },
      },
    })
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    shops: Shops,
    @param.where(Shops) where?: Where<Shops>,
  ): Promise<Count> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      return this.shopsRepository.updateAll(shops, where);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @get('/shops/{slug}')
  @response(200, {
    description: 'Shops model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Shops, {includeRelations: true}),
      },
    },
  })
  async findBySlug(
    @param.path.string('slug') slug: string,
    @param.filter(Shops, {exclude: 'where'})
    filter?: FilterExcludingWhere<Shops>,
  ): Promise<Shops | null> {
    return this.shopsRepository.findOne({
      where: {
        slug: slug,
      },
    });
  }

  @patch('/shops/{id}')
  @response(204, {
    description: 'Shops PATCH success',
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shops, {partial: true}),
        },
      },
    })
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    shops: Shops,
  ): Promise<void> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      await this.shopsRepository.updateById(id, shops);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @put('/shops/{id}')
  @response(204, {
    description: 'Shops PUT success',
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() shops: Shops,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      await this.shopsRepository.replaceById(id, shops);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @del('/shops/{id}')
  @response(204, {
    description: 'Shops DELETE success',
  })
  @authenticate('jwt')
  async deleteById(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      await this.shopsRepository.deleteById(id);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }
}
