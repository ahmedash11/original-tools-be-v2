import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Area, City} from '../../models';
import {AreaRepository} from '../../repositories';

export class AreaCityController {
  constructor(
    @repository(AreaRepository)
    public areaRepository: AreaRepository,
  ) {}

  @get('/areas/{id}/city', {
    responses: {
      '200': {
        description: 'City belonging to Area',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(City)},
          },
        },
      },
    },
  })
  async getCity(
    @param.path.number('id') id: typeof Area.prototype.id,
  ): Promise<City> {
    return this.areaRepository.city(id);
  }
}
