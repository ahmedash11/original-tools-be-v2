import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Category,
  Section,
} from '../../models';
import {CategoryRepository} from '../../repositories';

export class CategorySectionController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
  ) { }

  @get('/categories/{id}/section', {
    responses: {
      '200': {
        description: 'Section belonging to Category',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Section)},
          },
        },
      },
    },
  })
  async getSection(
    @param.path.number('id') id: typeof Category.prototype.id,
  ): Promise<Section> {
    return this.categoryRepository.section(id);
  }
}
