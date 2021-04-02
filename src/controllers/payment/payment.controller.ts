import {get, post, requestBody} from '@loopback/rest';
import axios from 'axios';
import SHA256 from 'sha256';

const MerchantCode = process.env.MERCHANTCODE;
const MerchantHashCode = process.env.MERCHANTHASHCODE;
const Token = process.env.TOKEN;
const tokenTest = process.env.STAGINGTOKEN;
console.log(Token);
console.log(MerchantHashCode);
console.log(MerchantCode);
console.log(tokenTest);

const AXIOS_BASE_URL = 'https://staging.cowpay.me/api/v1';
export class Payment {
  constructor() {}
  @post('/card')
  async CreditCardReq(@requestBody() req: any) {
    req.status = 'success';
    console.log(
      '🚀 ~ file: payment.controller.ts ~ line 236 ~ Payment ~ pay ~  MerchantFF',
      MerchantCode,
      req.merchant_reference_id,
      req.customer_merchant_profile_id,
      req.amount,
      MerchantHashCode,
    );
    let data = {
      merchant_reference_id: req.merchant_reference_id,
      payment_method: req.payment_method,
      customer_merchant_profile_id: req.customer_merchant_profile_id,
      card_number: req.card_number,
      expiry_year: req.expiry_year,
      expiry_month: req.expiry_month,
      cvv: req.cvv,
      customer_name: req.customer_name,
      customer_mobile: req.customer_mobile,
      customer_email: req.customer_email,
      amount: req.amount,
      description: req.description,
      signature: SHA256(
        [
          MerchantCode,
          req.merchant_reference_id,
          req.customer_merchant_profile_id,
          req.amount,
          MerchantHashCode,
        ].join(''),
      ),
    };
    let creditCardResp;
    let creditCardStatus;
    const options = {
      headers: {
        Authorization: `Bearer ${tokenTest}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };
    console.log(
      '🚀 ~ file: payment.controller.ts ~ line 247 ~ Payment ~ pay ~ f',
      data,
    );
    console.log(
      '🚀 ~ file: payment.controller.ts ~ line 255 ~ Payment ~ pay ~ options',
      options,
    );
    try {
      creditCardResp = await axios.post(
        `${AXIOS_BASE_URL}/charge/card`,
        data,
        options,
      );
      console.log(creditCardResp);
      creditCardStatus = await this.getPaymentStatus(
        data.merchant_reference_id,
      );
      console.log(creditCardStatus);
      return {payment: creditCardResp.data, status: creditCardStatus.data};
    } catch (err) {
      // Handle Error Here
      req.status = 400;

      console.error(err);
      return {error: err.response.data};
    }
  }

  @post('/fawry', {
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
  async fawryReq(@requestBody() req: any) {
    let data = {
      merchant_reference_id: req.merchant_reference_id,
      customer_merchant_profile_id: req.customer_merchant_profile_id,
      customer_name: req.customer_name,
      customer_mobile: req.customer_mobile,
      customer_email: req.customer_email,
      amount: req.amount,
      description: req.description,
      signature: SHA256(
        [
          MerchantCode,
          req.merchant_reference_id,
          req.customer_merchant_profile_id,
          req.amount,
          MerchantHashCode,
        ].join(''),
      ),
    };
    let fawryResp;
    let fawryStatus;
    const options = {
      headers: {
        Authorization: `Bearer ${tokenTest}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    console.log(
      '🚀 ~ file: payment.controller.ts ~ line 247 ~ Payment ~ pay ~ f',
      data,
    );
    console.log(
      '🚀 ~ file: payment.controller.ts ~ line 255 ~ Payment ~ pay ~ options',
      options,
    );
    try {
      fawryResp = await axios.post(
        `${AXIOS_BASE_URL}/charge/fawry`,
        data,
        options,
      );
      console.log(fawryResp);
      fawryStatus = await this.getPaymentStatus(data.merchant_reference_id);
      console.log(fawryStatus);
      return {payment: fawryResp.data, status: fawryStatus.data};
    } catch (err) {
      // Handle Error Here
      req.status = 400;

      console.error(err);
      return {error: err.response.data};
    }
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
  async getPaymentStatus(merchant_reference_id: string) {
    console.log(
      '🚀 ~ file: payment.controller.ts ~ line 189 ~ Payment ~ getPaymentStatus ~ merchant_reference_id',
      merchant_reference_id,
    );
    return axios.get(`${AXIOS_BASE_URL}/charge/status`, {
      data: {
        merchant_reference_id: merchant_reference_id,
        signature: SHA256(
          MerchantCode + merchant_reference_id + MerchantHashCode,
        ),
      },
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${tokenTest}`,
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
  async paymentCallBack() {}
}
