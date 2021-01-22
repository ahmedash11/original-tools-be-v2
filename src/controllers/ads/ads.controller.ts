import {inject} from '@loopback/core';
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
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {FILE_UPLOAD_SERVICE} from '../../keys';
import {Ads} from '../../models';
import {getFilesAndFields} from '../../services';
import {FileUploadHandler} from '../../types';
import {AdsRepository} from './../../repositories';

export class AdsController {
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
    @repository(AdsRepository)
    public adsRepository: AdsRepository,
  ) {}

  @post('/ads', {
    responses: {
      '200': {
        description: 'Ads model instance',
        content: {'application/json': {schema: getModelSchemaRef(Ads)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ads, {
            title: 'NewAds',
            exclude: ['id'],
          }),
        },
      },
    })
    ads: Omit<Ads, 'id'>,
  ): Promise<Ads> {
    return this.adsRepository.create(ads);
  }

  @get('/ads/count', {
    responses: {
      '200': {
        description: 'Ads model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Ads) where?: Where<Ads>): Promise<Count> {
    return this.adsRepository.count(where);
  }

  @get('/ads', {
    responses: {
      '200': {
        description: 'Array of Ads model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Ads, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Ads) filter?: Filter<Ads>): Promise<Ads[]> {
    return this.adsRepository.find(filter);
  }

  @patch('/ads', {
    responses: {
      '200': {
        description: 'Ads PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ads, {partial: true}),
        },
      },
    })
    ads: Ads,
    @param.where(Ads) where?: Where<Ads>,
  ): Promise<Count> {
    return this.adsRepository.updateAll(ads, where);
  }

  @get('/ads/{id}', {
    responses: {
      '200': {
        description: 'Ads model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Ads, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Ads, {exclude: 'where'}) filter?: FilterExcludingWhere<Ads>,
  ): Promise<Ads> {
    return this.adsRepository.findById(id, filter);
  }

  @post('/ads/upload', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  async fileUpload(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve(getFilesAndFields(request, 'ads'));
        }
      });
    });
  }

  @patch('/ads/{id}', {
    responses: {
      '204': {
        description: 'Ads PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ads, {partial: true}),
        },
      },
    })
    ads: Ads,
  ): Promise<Ads> {
    await this.adsRepository.updateById(id, ads);
    return this.adsRepository.findById(id);
  }

  @put('/ads/{id}', {
    responses: {
      '204': {
        description: 'Ads PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() ads: Ads,
  ): Promise<void> {
    await this.adsRepository.replaceById(id, ads);
  }

  @del('/ads/{id}', {
    responses: {
      '204': {
        description: 'Ads DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.adsRepository.deleteById(id);
  }
}
