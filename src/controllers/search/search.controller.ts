import {repository} from '@loopback/repository';
import {get, param, response} from '@loopback/rest';
import {
  BrandRepository,
  CategoryRepository,
  ProductRepository
} from '../../repositories';

export class SearchController {
  constructor(
    @repository(BrandRepository)
    public brandRepository: BrandRepository,
    @repository(ProductRepository)
    public ProductRepository: ProductRepository,
    @repository(CategoryRepository)
    public CategoryRepository: CategoryRepository,
  ) {}

  @get('/search')
  @response(200, {
    description: 'Array of Brand model instances',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async find(@param.query.string('search') search: string) {
    let filter = {like: `%${search}%`};
    if (!search) {
      search = '';
    }
    let searchTerm = {where: {title: filter}, limit: 5};

    const brandData = await this.brandRepository.find(searchTerm);
    const productData = await this.ProductRepository.find(searchTerm);
    const CateogryData = await this.CategoryRepository.find(searchTerm);

    const result = {brandData, productData, CateogryData};

    return result;
  }
}
