import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Type} from '../models';
import {TypeRepository} from '../repositories';

export class TypeController {
  constructor(
    @repository(TypeRepository)
    public typeRepository : TypeRepository,
  ) {}

  @post('/types', {
    responses: {
      '200': {
        description: 'Type model instance',
        content: {'application/json': {schema: getModelSchemaRef(Type)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Type, {
            title: 'NewType',
            exclude: ['id'],
          }),
        },
      },
    })
    type: Omit<Type, 'id'>,
  ): Promise<Type> {
    return this.typeRepository.create(type);
  }

  @get('/types/count', {
    responses: {
      '200': {
        description: 'Type model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Type) where?: Where<Type>,
  ): Promise<Count> {
    return this.typeRepository.count(where);
  }

  @get('/types', {
    responses: {
      '200': {
        description: 'Array of Type model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Type, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Type) filter?: Filter<Type>,
  ): Promise<Type[]> {
    return this.typeRepository.find(filter);
  }

  @patch('/types', {
    responses: {
      '200': {
        description: 'Type PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Type, {partial: true}),
        },
      },
    })
    type: Type,
    @param.where(Type) where?: Where<Type>,
  ): Promise<Count> {
    return this.typeRepository.updateAll(type, where);
  }

  @get('/types/{id}', {
    responses: {
      '200': {
        description: 'Type model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Type, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Type, {exclude: 'where'}) filter?: FilterExcludingWhere<Type>
  ): Promise<Type> {
    return this.typeRepository.findById(id, filter);
  }

  @patch('/types/{id}', {
    responses: {
      '204': {
        description: 'Type PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Type, {partial: true}),
        },
      },
    })
    type: Type,
  ): Promise<void> {
    await this.typeRepository.updateById(id, type);
  }

  @put('/types/{id}', {
    responses: {
      '204': {
        description: 'Type PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() type: Type,
  ): Promise<void> {
    await this.typeRepository.replaceById(id, type);
  }

  @del('/types/{id}', {
    responses: {
      '204': {
        description: 'Type DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.typeRepository.deleteById(id);
  }
}
