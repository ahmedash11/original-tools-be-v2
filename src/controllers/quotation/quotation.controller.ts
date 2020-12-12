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
import {Quotation} from '../../models';
import {QuotationRepository} from '../../repositories';

export class QuotationController {
  constructor(
    @repository(QuotationRepository)
    public quotationRepository: QuotationRepository,
  ) {}

  @post('/quotations', {
    responses: {
      '200': {
        description: 'Quotation model instance',
        content: {'application/json': {schema: getModelSchemaRef(Quotation)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Quotation, {
            title: 'NewQuotation',
            exclude: ['id'],
          }),
        },
      },
    })
    quotation: Omit<Quotation, 'id'>,
  ): Promise<Quotation> {
    return this.quotationRepository.create(quotation);
  }

  @get('/quotations/count', {
    responses: {
      '200': {
        description: 'Quotation model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Quotation) where?: Where<Quotation>,
  ): Promise<Count> {
    return this.quotationRepository.count(where);
  }

  @get('/quotations', {
    responses: {
      '200': {
        description: 'Array of Quotation model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Quotation, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Quotation) filter?: Filter<Quotation>,
  ): Promise<Quotation[]> {
    return this.quotationRepository.find(filter);
  }

  @patch('/quotations', {
    responses: {
      '200': {
        description: 'Quotation PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Quotation, {partial: true}),
        },
      },
    })
    quotation: Quotation,
    @param.where(Quotation) where?: Where<Quotation>,
  ): Promise<Count> {
    return this.quotationRepository.updateAll(quotation, where);
  }

  @get('/quotations/{id}', {
    responses: {
      '200': {
        description: 'Quotation model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Quotation, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Quotation, {exclude: 'where'})
    filter?: FilterExcludingWhere<Quotation>,
  ): Promise<Quotation> {
    return this.quotationRepository.findById(id, filter);
  }

  @patch('/quotations/{id}', {
    responses: {
      '204': {
        description: 'Quotation PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Quotation, {partial: true}),
        },
      },
    })
    quotation: Quotation,
  ): Promise<void> {
    await this.quotationRepository.updateById(id, quotation);
  }

  @put('/quotations/{id}', {
    responses: {
      '204': {
        description: 'Quotation PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() quotation: Quotation,
  ): Promise<void> {
    await this.quotationRepository.replaceById(id, quotation);
  }

  @del('/quotations/{id}', {
    responses: {
      '204': {
        description: 'Quotation DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.quotationRepository.deleteById(id);
  }
}
