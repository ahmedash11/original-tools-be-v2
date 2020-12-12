import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Address, City} from '../../models';
import {AddressRepository} from '../../repositories';

export class AddressCityController {
  constructor(
    @repository(AddressRepository)
    public addressRepository: AddressRepository,
  ) {}

  @get('/addresses/{id}/city', {
    responses: {
      '200': {
        description: 'City belonging to Address',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(City)},
          },
        },
      },
    },
  })
  async getCity(
    @param.path.number('id') id: typeof Address.prototype.id,
  ): Promise<City> {
    return this.addressRepository.city(id);
  }
}
