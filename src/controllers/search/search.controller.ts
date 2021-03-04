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
    let searchTerm = {
      where: {
        or: [{title: filter}, {slug: filter}],
        limit: 50,
      },
    };
    const brandData = await this.brandRepository.find(searchTerm);
    const productData = await this.ProductRepository.find(searchTerm);
    const subCateogryData = await this.CategoryRepository.find(searchTerm);

    return {brands: [brandData, productData, subCateogryData]};
  }
}
