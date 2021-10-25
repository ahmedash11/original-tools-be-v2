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
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Shops, User} from '../../models';
import {UserRepository} from '../../repositories';

export class UserShopsController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @get('/users/{id}/shops', {
    responses: {
      '200': {
        description: 'Array of User has many Shops',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Shops)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Shops>,
  ): Promise<Shops[]> {
    return this.userRepository.shops(id).find(filter);
  }

  @post('/users/{id}/shops', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Shops)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shops, {
            title: 'NewShopsInUser',
            exclude: ['id'],
            optional: ['userId'],
          }),
        },
      },
    })
    shops: Omit<Shops, 'id'>,
  ): Promise<Shops> {
    return this.userRepository.shops(id).create(shops);
  }

  @patch('/users/{id}/shops', {
    responses: {
      '200': {
        description: 'User.Shops PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shops, {partial: true}),
        },
      },
    })
    shops: Partial<Shops>,
    @param.query.object('where', getWhereSchemaFor(Shops)) where?: Where<Shops>,
  ): Promise<Count> {
    return this.userRepository.shops(id).patch(shops, where);
  }

  @del('/users/{id}/shops', {
    responses: {
      '200': {
        description: 'User.Shops DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Shops)) where?: Where<Shops>,
  ): Promise<Count> {
    return this.userRepository.shops(id).delete(where);
  }
}
