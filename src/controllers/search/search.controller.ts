import {repository} from '@loopback/repository';
import {
  get,
  param,




  response
} from '@loopback/rest';
import {BrandRepository, CategoryRepository, ProductRepository} from '../../repositories';


export class SearchController {
  constructor(
    @repository(BrandRepository)
    public brandRepository: BrandRepository,
    @repository(ProductRepository)
    public ProductRepository: ProductRepository,
    @repository(CategoryRepository)
    public CategoryRepository: CategoryRepository
  ) { }



  @get('/search/{search}')
  @response(200, {
    description: 'Array of Brand model instances',
    content: {
      'application/json': {
        schema: {
          type: 'object'
        },
      },
    },
  })
  async find(
     @param.path.string('search') search: string,
  ) {

    const brandData = await this.brandRepository.find({ where: {or: [{title:{regexp: '[a-z]' || '[A-Z]'} }, {slug: {regexp: '[a-z]' || '[A-Z]'}}]}});
    const productData = await this.ProductRepository.find({ where:  {or: [{title:{regexp: '[a-z]' || '[A-Z]'} }, {slug: {regexp: '[a-z]' || '[A-Z]'}}]}});
    const subCateogryData = await this.CategoryRepository.find({ where: {or: [{title:{regexp: '[a-z]' || '[A-Z]'} }, {slug: {regexp: '[a-z]' || '[A-Z]'}}]}});

    return {"brands": brandData, productData, subCateogryData}
  }
}
