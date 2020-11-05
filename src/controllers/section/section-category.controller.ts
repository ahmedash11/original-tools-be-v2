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
import {
  Section,
  Category,
} from '../../models';
import {SectionRepository} from '../../repositories';

export class SectionCategoryController {
  constructor(
    @repository(SectionRepository) protected sectionRepository: SectionRepository,
  ) { }

  @get('/sections/{id}/categories', {
    responses: {
      '200': {
        description: 'Array of Section has many Category',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Category)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Category>,
  ): Promise<Category[]> {
    return this.sectionRepository.categories(id).find(filter);
  }

  @post('/sections/{id}/categories', {
    responses: {
      '200': {
        description: 'Section model instance',
        content: {'application/json': {schema: getModelSchemaRef(Category)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Section.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {
            title: 'NewCategoryInSection',
            exclude: ['id'],
            optional: ['sectionId']
          }),
        },
      },
    }) category: Omit<Category, 'id'>,
  ): Promise<Category> {
    return this.sectionRepository.categories(id).create(category);
  }

  @patch('/sections/{id}/categories', {
    responses: {
      '200': {
        description: 'Section.Category PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    category: Partial<Category>,
    @param.query.object('where', getWhereSchemaFor(Category)) where?: Where<Category>,
  ): Promise<Count> {
    return this.sectionRepository.categories(id).patch(category, where);
  }

  @del('/sections/{id}/categories', {
    responses: {
      '200': {
        description: 'Section.Category DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Category)) where?: Where<Category>,
  ): Promise<Count> {
    return this.sectionRepository.categories(id).delete(where);
  }
}
