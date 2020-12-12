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
import {Customer, Quotation} from '../../models';
import {CustomerRepository} from '../../repositories';

export class CustomerQuotationController {
  constructor(
    @repository(CustomerRepository)
    protected customerRepository: CustomerRepository,
  ) {}

  @get('/customers/{id}/quotations', {
    responses: {
      '200': {
        description: 'Array of Customer has many Quotation',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Quotation)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Quotation>,
  ): Promise<Quotation[]> {
    return this.customerRepository.quotations(id).find(filter);
  }

  @post('/customers/{id}/quotations', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: {'application/json': {schema: getModelSchemaRef(Quotation)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Customer.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Quotation, {
            title: 'NewQuotationInCustomer',
            exclude: ['id'],
            optional: ['customerId'],
          }),
        },
      },
    })
    quotation: Omit<Quotation, 'id'>,
  ): Promise<Quotation> {
    return this.customerRepository.quotations(id).create(quotation);
  }

  @patch('/customers/{id}/quotations', {
    responses: {
      '200': {
        description: 'Customer.Quotation PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Quotation, {partial: true}),
        },
      },
    })
    quotation: Partial<Quotation>,
    @param.query.object('where', getWhereSchemaFor(Quotation))
    where?: Where<Quotation>,
  ): Promise<Count> {
    return this.customerRepository.quotations(id).patch(quotation, where);
  }

  @del('/customers/{id}/quotations', {
    responses: {
      '200': {
        description: 'Customer.Quotation DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Quotation))
    where?: Where<Quotation>,
  ): Promise<Count> {
    return this.customerRepository.quotations(id).delete(where);
  }
}
