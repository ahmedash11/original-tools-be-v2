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
import {Category, CategoryRelations, Product} from '../../models';
import {CategoryRepository} from '../../repositories';

export class CategoryProductController {
  constructor(
    @repository(CategoryRepository)
    protected categoryRepository: CategoryRepository,
  ) {}

  @get('/categories/{slug}/products', {
    responses: {
      '200': {
        description: 'Array of Category has many Product',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('slug') slug: string,
    @param.query.object('filter') filter?: Filter<Product>,
  ): Promise<{
    filters: {
      type: string;
      slug: string;
      name: string;
      items: (Category & CategoryRelations)[];
    };
    items: Product[];
  }> {
    const category = await this.categoryRepository.findOne({
      where: {
        slug: slug,
      },
    });

    const response = {
      filters: {
        type: 'category',
        slug: 'categories',
        name: 'Categories',
        items: [
          ...(await this.categoryRepository.find({
            where: {
              parentId: category?.parentId,
            },
          })),
          ...(await this.categoryRepository.find({
            where: {
              parentId: undefined,
            },
            limit: 5,
          })),
        ],
      },
      items: category
        ? await this.categoryRepository.products(category?.id).find(filter)
        : [],
    };

    return response;
  }

  @post('/categories/{id}/products', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {'application/json': {schema: getModelSchemaRef(Product)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Category.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProductInCategory',
            exclude: ['id'],
            optional: ['categoryId'],
          }),
        },
      },
    })
    product: Omit<Product, 'id'>,
  ): Promise<Product> {
    return this.categoryRepository.products(id).create(product);
  }

  @patch('/categories/{id}/products', {
    responses: {
      '200': {
        description: 'Category.Product PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
    product: Partial<Product>,
    @param.query.object('where', getWhereSchemaFor(Product))
    where?: Where<Product>,
  ): Promise<Count> {
    return this.categoryRepository.products(id).patch(product, where);
  }

  @del('/categories/{id}/products', {
    responses: {
      '200': {
        description: 'Category.Product DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Product))
    where?: Where<Product>,
  ): Promise<Count> {
    return this.categoryRepository.products(id).delete(where);
  }
}
