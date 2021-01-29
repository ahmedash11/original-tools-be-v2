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
import {Toolbar} from '../../models';
import {ToolbarRepository} from '../../repositories';

export class ToolbarController {
  constructor(
    @repository(ToolbarRepository)
    public toolbarRepository: ToolbarRepository,
  ) {}

  @post('/toolbars', {
    responses: {
      '200': {
        description: 'Toolbar model instance',
        content: {'application/json': {schema: getModelSchemaRef(Toolbar)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Toolbar, {
            title: 'NewToolbar',
            exclude: ['id'],
          }),
        },
      },
    })
    toolbar: Omit<Toolbar, 'id'>,
  ): Promise<Toolbar> {
    return this.toolbarRepository.create(toolbar);
  }

  @get('/toolbars/count', {
    responses: {
      '200': {
        description: 'Toolbar model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Toolbar) where?: Where<Toolbar>): Promise<Count> {
    return this.toolbarRepository.count(where);
  }

  @get('/toolbars', {
    responses: {
      '200': {
        description: 'Array of Toolbar model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Toolbar, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Toolbar) filter?: Filter<Toolbar>,
  ): Promise<Toolbar[]> {
    return this.toolbarRepository.find(filter);
  }

  @patch('/toolbars', {
    responses: {
      '200': {
        description: 'Toolbar PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Toolbar, {partial: true}),
        },
      },
    })
    toolbar: Toolbar,
    @param.where(Toolbar) where?: Where<Toolbar>,
  ): Promise<Count> {
    return this.toolbarRepository.updateAll(toolbar, where);
  }

  @get('/toolbars/{id}', {
    responses: {
      '200': {
        description: 'Toolbar model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Toolbar, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Toolbar, {exclude: 'where'})
    filter?: FilterExcludingWhere<Toolbar>,
  ): Promise<Toolbar> {
    return this.toolbarRepository.findById(id, filter);
  }

  @patch('/toolbars/{id}', {
    responses: {
      '204': {
        description: 'Toolbar PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Toolbar, {partial: true}),
        },
      },
    })
    toolbar: Toolbar,
  ): Promise<Toolbar> {
    await this.toolbarRepository.updateById(id, toolbar);
    return this.toolbarRepository.findById(id);
  }

  @put('/toolbars/{id}', {
    responses: {
      '204': {
        description: 'Toolbar PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() toolbar: Toolbar,
  ): Promise<void> {
    await this.toolbarRepository.replaceById(id, toolbar);
  }

  @del('/toolbars/{id}', {
    responses: {
      '204': {
        description: 'Toolbar DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.toolbarRepository.deleteById(id);
  }
}
