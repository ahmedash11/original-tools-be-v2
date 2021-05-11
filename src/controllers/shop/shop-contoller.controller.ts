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
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Shops} from '../../models';
import {ShopsRepository} from '../../repositories';

export class ShopContoller {
  constructor(
    @repository(ShopsRepository)
    public shopsRepository: ShopsRepository,
  ) {}

  @post('/shops')
  @response(200, {
    description: 'Shops model instance',
    content: {'application/json': {schema: getModelSchemaRef(Shops)}},
  })
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
  ): Promise<Shops> {
    return this.shopsRepository.create(shops);
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
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shops, {partial: true}),
        },
      },
    })
    shops: Shops,
    @param.where(Shops) where?: Where<Shops>,
  ): Promise<Count> {
    return this.shopsRepository.updateAll(shops, where);
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
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shops, {partial: true}),
        },
      },
    })
    shops: Shops,
  ): Promise<void> {
    await this.shopsRepository.updateById(id, shops);
  }

  @put('/shops/{id}')
  @response(204, {
    description: 'Shops PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() shops: Shops,
  ): Promise<void> {
    await this.shopsRepository.replaceById(id, shops);
  }

  @del('/shops/{id}')
  @response(204, {
    description: 'Shops DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.shopsRepository.deleteById(id);
  }
}
