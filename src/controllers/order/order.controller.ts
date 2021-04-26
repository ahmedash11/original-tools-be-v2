import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  DefaultTransactionalRepository,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody
} from '@loopback/rest';
import axios from 'axios';
import SHA256 from 'sha256';
import {DbDataSource} from '../../datasources';
import {Address, Customer, Order} from '../../models';
import {
  AddressRepository,
  CustomerRepository,
  OrderProductRepository,
  OrderRepository
} from '../../repositories';

const MerchantCode = process.env.MERCHANTCODE;
const MerchantHashCode = process.env.MERCHANTHASHCODE;
// const Token = process.env.TOKEN;
const stagingToken = process.env.STAGINGTOKEN;

const AXIOS_BASE_URL = 'https://staging.cowpay.me/api/v1';
export class OrderController {
  constructor(
    @inject('datasources.db') private dataSource: DbDataSource,
    @repository(OrderRepository)
    public orderRepository: OrderRepository,
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @repository(AddressRepository)
    public addressRepository: AddressRepository,
    @repository(OrderProductRepository)
    public orderProductRepository: OrderProductRepository,
  ) {}

  @post('/orders', {
    responses: {
      '200': {
        description: 'Order model instance',
        content: {'application/json': {schema: getModelSchemaRef(Order)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            address: Address,
            customer: Customer,
            products: Object,
            total: Number,
            creditCard: Object,
            paymentMethod: String,
          },
        },
      },
    })
    order: {
      address: Address;
      customer: Customer;
      products: object[];
      total: number;
      creditCard: {
        card_number: string;
        expiry_year: string;
        expiry_month: string;
        cvv: string;
      };
      paymentMethod: string;
    },
  ): Promise<Order> {
    const repo = new DefaultTransactionalRepository(Order, this.dataSource);
    try {
      const {
        customer,
        address,
        products,
        total,
        creditCard,
        paymentMethod,
      } = order;

      let creditCardResp: any;
      let creditCardStatus;
      let fawryResp;
      let fawryStatus;
      let creditCardData;
      let fawryData;

      const options = {
        headers: {
          Authorization: `Bearer ${stagingToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      };

      const customerData = await this.customerRepository.create(customer);
      await this.addressRepository.create(address);
      let orderData = {
        customerId: customerData.id,
        total: total,
        orderDate: new Date(),
      };
      let newOrder = await this.orderRepository.create(orderData);
      await this.orderProductRepository.createAll(
        products.map(product => ({...product, orderId: newOrder.id})),
      );

      if (paymentMethod === 'creditcard') {
        creditCardData = {
          merchant_reference_id: newOrder.id?.toString(),
          customer_merchant_profile_id: orderData.customerId?.toString(),
          card_number: creditCard.card_number.replace(/ /g, ''),
          expiry_year: creditCard.expiry_year,
          expiry_month: creditCard.expiry_month,
          cvv: creditCard.cvv,
          customer_name: customer.firstName,
          customer_mobile: customer.mobile,
          customer_email: customer.email,
          amount: total.toFixed(2),
          description: 'creditCard Charge Request',
          signature: SHA256(
            [
              MerchantCode,
              newOrder.id?.toString(),
              orderData.customerId?.toString(),
              total.toFixed(2),
              MerchantHashCode,
            ].join(''),
          ),
        };

        try {
          creditCardResp = await axios.post(
            `${AXIOS_BASE_URL}/charge/card`,
            creditCardData,
            options,
          );
          return creditCardResp.data;
        } catch (err) {
          // Handle Error Here
          console.error(err);
        }
      } else if (paymentMethod === 'fawry') {
        fawryData = {
          merchant_reference_id: newOrder.id?.toString(),
          customer_merchant_profile_id: orderData.customerId?.toString(),
          customer_name: customer.firstName,
          customer_mobile: customer.mobile,
          customer_email: customer.email,
          amount: total.toFixed(2),
          description: 'Fawry Charge Request',
          signature: SHA256(
            [
              MerchantCode,
              newOrder.id?.toString(),
              orderData.customerId?.toString(),
              total.toFixed(2),
              MerchantHashCode,
            ].join(''),
          ),
        };

        try {
          fawryResp = await axios.post(
            `${AXIOS_BASE_URL}/charge/fawry`,
            fawryData,
            options,
          );
          fawryStatus = await this.getPaymentStatus(
            fawryData.merchant_reference_id,
          );
        } catch (err) {
          // Handle Error Here
          console.error(err);
        }
      }

      return newOrder;
    } catch (err) {
      throw err;
    }
  }

  @get('/orders/count', {
    responses: {
      '200': {
        description: 'Order model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Order) where?: Where<Order>): Promise<Count> {
    return this.orderRepository.count(where);
  }

  @get('/orders', {
    responses: {
      '200': {
        description: 'Array of Order model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Order, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Order) filter?: Filter<Order>): Promise<Order[]> {
    return this.orderRepository.find(filter);
  }

  @patch('/orders', {
    responses: {
      '200': {
        description: 'Order PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true}),
        },
      },
    })
    order: Order,
    @param.where(Order) where?: Where<Order>,
  ): Promise<Count> {
    return this.orderRepository.updateAll(order, where);
  }

  @get('/orders/{id}', {
    responses: {
      '200': {
        description: 'Order model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Order, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Order, {exclude: 'where'})
    filter?: FilterExcludingWhere<Order>,
  ): Promise<Order> {
    return this.orderRepository.findById(id, filter);
  }

  @patch('/orders/{id}', {
    responses: {
      '204': {
        description: 'Order PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true}),
        },
      },
    })
    order: Order,
  ): Promise<void> {
    await this.orderRepository.updateById(id, order);
  }

  @put('/orders/{id}', {
    responses: {
      '204': {
        description: 'Order PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() order: Order,
  ): Promise<void> {
    await this.orderRepository.replaceById(id, order);
  }

  @del('/orders/{id}', {
    responses: {
      '204': {
        description: 'Order DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.orderRepository.deleteById(id);
  }

  @get('/status', {
    responses: {
      '200': {
        Accept: 'application/json',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async getPaymentStatus(merchant_reference_id: any) {
    return axios.get(`${AXIOS_BASE_URL}/charge/status`, {
      data: {
        merchant_reference_id: merchant_reference_id,
        signature: SHA256(
          MerchantCode + merchant_reference_id + MerchantHashCode,
        ),
      },
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${stagingToken}`,
      },
    });
  }

  @get('/cowpayresponse', {
    responses: {
      '200': {
        Accept: 'application/json',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async paymentCallBack(res: any) {
    console.log(res);
  }
}
