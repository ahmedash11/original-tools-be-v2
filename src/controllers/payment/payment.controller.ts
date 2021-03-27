import {post} from '@loopback/rest';
import axios from 'axios';
import SHA256 from 'sha256';

const pageUrl = 'https://cowpay.me/p/tools-shop/page/605';
const MerchantCode = process.env.MerchantCode;
const MerchantHashCode = process.env.MerchantHashCode;
console.log(MerchantHashCode);

axios.defaults.baseURL = 'https://cowpay.me/api/v1/';

export class Payment {
  constructor() {}
  @post('/payment/card', {
    responses: {
      '200': {
        authorization: `Bearer: ${MerchantHashCode}`,
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
  async creditCardReq(data: any) {
    return axios
      .post('charge/card', {
        merchant_reference_id: data.merchant_reference_id,
        payment_method: data.payment_method,
        customer_merchant_profile_id: data.customer_merchant_profile_id,
        card_number: data.card_number,
        expiry_year: data.expiry_year,
        expiry_month: data.expiry_month,
        cvv: data.cvv,
        customer_name: data.customer_name,
        customer_mobile: data.customer_mobile,
        customer_email: data.customer_email,
        amount: data.amount,
        description: data.description,
        signature: SHA256([
          data.MerchantCode,
          data.merchant_reference_id,
          data.customer_merchant_profile_id,
          data.amount,
          data.merchant_hash,
        ]),
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  @post('/payment/fawry', {
    responses: {
      '200': {
        authorization: `Bearer: ${MerchantHashCode}`,
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
  async fawryReq(data: any) {
    return axios
      .post('charge/fawry', {
        merchant_reference_id: data.merchant_reference_id,
        customer_merchant_profile_id: data.customer_merchant_profile_id,
        customer_name: data.customer_name,
        customer_mobile: data.customer_mobile,
        customer_email: data.customer_email,
        amount: data.amount,
        description: data.description,
        signature: SHA256([
          data.MerchantCode,
          data.merchant_reference_id,
          data.customer_merchant_profile_id,
          data.amount,
          data.merchant_hash,
        ]),
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
}
