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
} from '@loopback/rest';
import {City} from '../../models';
import {CityRepository} from '../../repositories';

export class CityController {
  constructor(
    @repository(CityRepository)
    public cityRepository: CityRepository,
  ) {}

  @post('/cities', {
    responses: {
      '200': {
        description: 'City model instance',
        content: {'application/json': {schema: getModelSchemaRef(City)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {
            title: 'NewCity',
            exclude: ['id'],
          }),
        },
      },
    })
    city: Omit<City, 'id'>,
  ): Promise<City> {
    return this.cityRepository.create(city);
  }

  @get('/cities/count', {
    responses: {
      '200': {
        description: 'City model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(City) where?: Where<City>): Promise<Count> {
    return this.cityRepository.count(where);
  }

  @get('/cities', {
    responses: {
      '200': {
        description: 'Array of City model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(City, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(City) filter?: Filter<City>): Promise<City[]> {
    return this.cityRepository.find(filter);
  }

  @patch('/cities', {
    responses: {
      '200': {
        description: 'City PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {partial: true}),
        },
      },
    })
    city: City,
    @param.where(City) where?: Where<City>,
  ): Promise<Count> {
    return this.cityRepository.updateAll(city, where);
  }

  @get('/cities/{id}', {
    responses: {
      '200': {
        description: 'City model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(City, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(City, {exclude: 'where'}) filter?: FilterExcludingWhere<City>,
  ): Promise<City> {
    return this.cityRepository.findById(id, filter);
  }

  @patch('/cities/{id}', {
    responses: {
      '204': {
        description: 'City PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {partial: true}),
        },
      },
    })
    city: City,
  ): Promise<void> {
    await this.cityRepository.updateById(id, city);
  }

  @put('/cities/{id}', {
    responses: {
      '204': {
        description: 'City PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() city: City,
  ): Promise<void> {
    await this.cityRepository.replaceById(id, city);
  }

  @del('/cities/{id}', {
    responses: {
      '204': {
        description: 'City DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.cityRepository.deleteById(id);
  }
}
