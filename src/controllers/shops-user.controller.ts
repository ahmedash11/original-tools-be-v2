import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Shops,
  User,
} from '../models';
import {ShopsRepository} from '../repositories';

export class ShopsUserController {
  constructor(
    @repository(ShopsRepository)
    public shopsRepository: ShopsRepository,
  ) { }

  @get('/shops/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Shops',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Shops.prototype.id,
  ): Promise<User> {
    return this.shopsRepository.user(id);
  }
}
