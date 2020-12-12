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
import {Area, City} from '../../models';
import {CityRepository} from '../../repositories';

export class CityAreaController {
  constructor(
    @repository(CityRepository) protected cityRepository: CityRepository,
  ) {}

  @get('/cities/{id}/areas', {
    responses: {
      '200': {
        description: 'Array of City has many Area',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Area)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Area>,
  ): Promise<Area[]> {
    return this.cityRepository.areas(id).find(filter);
  }

  @post('/cities/{id}/areas', {
    responses: {
      '200': {
        description: 'City model instance',
        content: {'application/json': {schema: getModelSchemaRef(Area)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof City.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Area, {
            title: 'NewAreaInCity',
            exclude: ['id'],
            optional: ['cityId'],
          }),
        },
      },
    })
    area: Omit<Area, 'id'>,
  ): Promise<Area> {
    return this.cityRepository.areas(id).create(area);
  }

  @patch('/cities/{id}/areas', {
    responses: {
      '200': {
        description: 'City.Area PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Area, {partial: true}),
        },
      },
    })
    area: Partial<Area>,
    @param.query.object('where', getWhereSchemaFor(Area)) where?: Where<Area>,
  ): Promise<Count> {
    return this.cityRepository.areas(id).patch(area, where);
  }

  @del('/cities/{id}/areas', {
    responses: {
      '200': {
        description: 'City.Area DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Area)) where?: Where<Area>,
  ): Promise<Count> {
    return this.cityRepository.areas(id).delete(where);
  }
}
