import {authenticate} from '@loopback/authentication';
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
  HttpErrors,
  param,
  patch,
  post,
  put,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {FILE_UPLOAD_SERVICE} from '../../keys';
import {Ads} from '../../models';
import {getFilesAndFields} from '../../services';
import {FileUploadHandler} from '../../types';
import {AdsRepository, UserRepository} from './../../repositories';

export class AdsController {
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
    @repository(UserRepository) public userRepository: UserRepository,
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
  @authenticate('jwt')
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
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    ads: Omit<Ads, 'id'>,
  ): Promise<Ads> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      return this.adsRepository.create(ads);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
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
  @authenticate('jwt')
  async fileUpload(
    @requestBody.file()
    currentUserProfile: UserProfile,
    request: Request,
    @inject(RestBindings.Http.RESPONSE)
    response: Response,
  ): Promise<object> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);

    if ((await currenrUser).role == 'owner') {
      return new Promise<object>((resolve, reject) => {
        this.handler(request, response, (err: unknown) => {
          if (err) reject(err);
          else {
            resolve(getFilesAndFields(request, 'ads'));
          }
        });
      });
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @patch('/ads/{id}', {
    responses: {
      '204': {
        description: 'Ads PATCH success',
      },
    },
  })
  @authenticate('jwt')
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
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Ads | undefined> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    try {
      await this.adsRepository.updateById(id, ads);

      if ((await currenrUser).role == 'owner') {
        await this.adsRepository.updateById(id, ads);

        return this.adsRepository.findById(id);
      } else {
        throw new HttpErrors.Forbidden('acces denied');
      }
    } catch (err) {
      console.log(err);
    }
  }

  @put('/ads/{id}', {
    responses: {
      '204': {
        description: 'Ads PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() ads: Ads,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      await this.adsRepository.replaceById(id, ads);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }

  @del('/ads/{id}', {
    responses: {
      '204': {
        description: 'Ads DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
    if ((await currenrUser).role == 'owner') {
      await this.adsRepository.deleteById(id);
    } else {
      throw new HttpErrors.Forbidden('acces denied');
    }
  }
}
