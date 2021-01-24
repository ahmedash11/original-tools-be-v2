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
import {Section} from '../../models';
import {SectionRepository} from '../../repositories';
import {generateSlug} from '../../services';

export class SectionController {
  constructor(
    @repository(SectionRepository)
    public sectionRepository: SectionRepository,
  ) {}

  @post('/sections', {
    responses: {
      '200': {
        description: 'Section model instance',
        content: {'application/json': {schema: getModelSchemaRef(Section)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Section, {
            title: 'NewSection',
            exclude: ['id'],
          }),
        },
      },
    })
    section: Omit<Section, 'id'>,
  ): Promise<Section> {
    section.slug = generateSlug(section.title);
    return this.sectionRepository.create(section);
  }

  @get('/sections/count', {
    responses: {
      '200': {
        description: 'Section model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Section) where?: Where<Section>): Promise<Count> {
    return this.sectionRepository.count(where);
  }

  @get('/sections', {
    responses: {
      '200': {
        description: 'Array of Section model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Section, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Section) filter?: Filter<Section>,
  ): Promise<Section[]> {
    return this.sectionRepository.find(filter);
  }

  @patch('/sections', {
    responses: {
      '200': {
        description: 'Section PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Section, {partial: true}),
        },
      },
    })
    section: Section,
    @param.where(Section) where?: Where<Section>,
  ): Promise<Count> {
    return this.sectionRepository.updateAll(section, where);
  }

  @get('/sections/{slug}', {
    responses: {
      '200': {
        description: 'Section model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Section, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findBySlug(
    @param.path.string('slug') slug: string,
    @param.filter(Section, {exclude: 'where'})
    filter?: FilterExcludingWhere<Section>,
  ): Promise<Section | null> {
    return this.sectionRepository.findOne({
      where: {
        slug: slug,
      },
      ...filter,
    });
  }

  @patch('/sections/{id}', {
    responses: {
      '204': {
        description: 'Section PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Section, {partial: true}),
        },
      },
    })
    section: Section,
  ): Promise<Section> {
    section.slug = generateSlug(section.title);
    await this.sectionRepository.updateById(id, section);
    return this.sectionRepository.findById(id);
  }

  @put('/sections/{id}', {
    responses: {
      '204': {
        description: 'Section PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() section: Section,
  ): Promise<void> {
    await this.sectionRepository.replaceById(id, section);
  }

  @del('/sections/{id}', {
    responses: {
      '204': {
        description: 'Section DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.sectionRepository.deleteById(id);
  }
}
