import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Address, Area} from '../../models';
import {AddressRepository} from '../../repositories';

export class AddressAreaController {
  constructor(
    @repository(AddressRepository)
    public addressRepository: AddressRepository,
  ) {}

  @get('/addresses/{id}/area', {
    responses: {
      '200': {
        description: 'Area belonging to Address',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Area)},
          },
        },
      },
    },
  })
  async getArea(
    @param.path.number('id') id: typeof Address.prototype.id,
  ): Promise<Area> {
    return this.addressRepository.area(id);
  }
}
