// import {authenticate, TokenService} from '@loopback/authentication';
// import {
//   Credentials,
//   MyUserService,
//   TokenServiceBindings,
//   UserRepository,
//   UserServiceBindings,
// } from '@loopback/authentication-jwt';
// import {inject} from '@loopback/core';
// import {model, property, repository} from '@loopback/repository';
// import {get, HttpErrors, post, requestBody, SchemaObject} from '@loopback/rest';
// import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
// import {compare} from 'bcryptjs';
// import {User} from '../../models';

// @model()
// export class NewUserRequest extends User {
//   @property({
//     type: 'string',
//     required: true,
//   })
//   password: string;
// }

// const CredentialsSchema: SchemaObject = {
//   type: 'object',
//   required: ['email', 'password'],
//   properties: {
//     email: {
//       type: 'string',
//       format: 'email',
//     },
//     password: {
//       type: 'string',
//       minLength: 8,
//     },
//   },
// };

// export const CredentialsRequestBody = {
//   description: 'The input of login function',
//   required: true,
//   content: {
//     'application/json': {schema: CredentialsSchema},
//   },
// };

// export class UserController {
//   constructor(
//     @inject(TokenServiceBindings.TOKEN_SERVICE)
//     public jwtService: TokenService,
//     @inject(UserServiceBindings.USER_SERVICE)
//     public userService: MyUserService,
//     @inject(SecurityBindings.USER, {optional: true})
//     public user: UserProfile,
//     @repository(UserRepository)
//     protected userRepository: UserRepository,
//   ) {}

//   @post('/users/login', {
//     responses: {
//       '200': {
//         description: 'Token',
//         content: {
//           'application/json': {
//             schema: {
//               type: 'object',
//               properties: {
//                 token: {
//                   type: 'string',
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   })
//   async login(
//     @requestBody(CredentialsRequestBody) credentials: Credentials,
//   ): Promise<{token: string}> {
//     // ensure the user exists, and the password is correct
//     const verifyCredentials = async (credentials: Credentials) => {
//       const invalidCredentialsError = 'Invalid email or password.';
//       const foundUser = await this.userRepository.findOne({
//         where: {email: credentials.email},
//       });
//       if (!foundUser) {
//         throw new HttpErrors.Unauthorized(invalidCredentialsError);
//       }
//       const credentialsFound = await this.userRepository.findOne({
//         where: {id: foundUser.id},
//       });
//       if (!credentialsFound) {
//         throw new HttpErrors.Unauthorized(invalidCredentialsError);
//       }
//       const passwordMatched = await compare(
//         credentials.password,
//         credentialsFound.password,
//       );
//       if (!passwordMatched) {
//         throw new HttpErrors.Unauthorized(invalidCredentialsError);
//       }
//       return foundUser;
//     };
//     const user = await verifyCredentials(credentials);
//     // convert a User object into a UserProfile object (reduced set of properties)
//     const userProfile = this.userService.convertToUserProfile(user);

//     // create a JSON Web Token based on the user profile
//     const token = await this.jwtService.generateToken(userProfile);
//     return {token};
//   }

//   @authenticate('jwt')
//   @get('/whoAmI', {
//     responses: {
//       '200': {
//         description: 'Return current user',
//         content: {
//           'application/json': {
//             schema: {
//               type: 'string',
//             },
//           },
//         },
//       },
//     },
//   })
//   async whoAmI(
//     @inject(SecurityBindings.USER)
//     currentUserProfile: UserProfile,
//   ): Promise<string> {
//     return currentUserProfile[securityId];
//   }

// @post('/users', {
//   responses: {
//     '200': {
//       description: 'User model instance',
//       content: {'application/json': {schema: getModelSchemaRef(User)}},
//     },
//   },
// })
// async create(
//   @requestBody({
//     content: {
//       'application/json': {
//         schema: getModelSchemaRef(User, {
//           title: 'NewUser',
//           exclude: ['id'],
//         }),
//       },
//     },
//   })
//   user: Omit<User, 'id'>,
// ): Promise<User> {
//   return this.userRepository.create(user);
// }

// @get('/users/count', {
//   responses: {
//     '200': {
//       description: 'User model count',
//       content: {'application/json': {schema: CountSchema}},
//     },
//   },
// })
// async count(@param.where(User) where?: Where<User>): Promise<Count> {
//   return this.userRepository.count(where);
// }

// @get('/users', {
//   responses: {
//     '200': {
//       description: 'Array of User model instances',
//       content: {
//         'application/json': {
//           schema: {
//             type: 'array',
//             items: getModelSchemaRef(User, {includeRelations: true}),
//           },
//         },
//       },
//     },
//   },
// })
// async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
//   return this.userRepository.find(filter);
// }

// @patch('/users', {
//   responses: {
//     '200': {
//       description: 'User PATCH success count',
//       content: {'application/json': {schema: CountSchema}},
//     },
//   },
// })
// async updateAll(
//   @requestBody({
//     content: {
//       'application/json': {
//         schema: getModelSchemaRef(User, {partial: true}),
//       },
//     },
//   })
//   user: User,
//   @param.where(User) where?: Where<User>,
// ): Promise<Count> {
//   return this.userRepository.updateAll(user, where);
// }

// @get('/users/{id}', {
//   responses: {
//     '200': {
//       description: 'User model instance',
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(User, {includeRelations: true}),
//         },
//       },
//     },
//   },
// })
// async findById(
//   @param.path.number('id') id: number,
//   @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
// ): Promise<User> {
//   return this.userRepository.findById(id, filter);
// }

// @patch('/users/{id}', {
//   responses: {
//     '204': {
//       description: 'User PATCH success',
//     },
//   },
// })
// async updateById(
//   @param.path.number('id') id: number,
//   @requestBody({
//     content: {
//       'application/json': {
//         schema: getModelSchemaRef(User, {partial: true}),
//       },
//     },
//   })
//   user: User,
// ): Promise<void> {
//   await this.userRepository.updateById(id, user);
// }

// @put('/users/{id}', {
//   responses: {
//     '204': {
//       description: 'User PUT success',
//     },
//   },
// })
// async replaceById(
//   @param.path.number('id') id: number,
//   @requestBody() user: User,
// ): Promise<void> {
//   await this.userRepository.replaceById(id, user);
// }

// @del('/users/{id}', {
//   responses: {
//     '204': {
//       description: 'User DELETE success',
//     },
//   },
// })
// async deleteById(@param.path.number('id') id: number): Promise<void> {
//   await this.userRepository.deleteById(id);
// }
// }
import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import _ from 'lodash';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings,
} from '../../keys';
import {basicAuthorization} from '../../middlewares/auth.midd';
import {User} from '../../models';
import {Credentials, UserRepository} from '../../repositories';
import {PasswordHasher, validateCredentials} from '../../services';
import {
  CredentialsRequestBody,
  UserProfileSchema,
} from '../specs/user.controller.specs';

@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
  ) {}

  @post('/users/sign-up', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async create(
    @requestBody(CredentialsRequestBody)
    newUserRequest: Credentials,
  ): Promise<User> {
    newUserRequest.role = 'user';

    // ensure a valid email value and password value
    validateCredentials(_.pick(newUserRequest, ['email', 'password']));

    // encrypt the password
    const password = await this.passwordHasher.hashPassword(
      newUserRequest.password,
    );

    try {
      // create the new user
      const savedUser = await this.userRepository.create(
        _.omit(newUserRequest, 'password'),
      );

      // set the password
      await this.userRepository
        .userCredentials(savedUser.id)
        .create({password});

      return savedUser;
    } catch (error) {
      // MongoError 11000 duplicate key
      if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
        throw new HttpErrors.Conflict('Email value is already taken');
      } else {
        throw error;
      }
    }
  }

  @post('/users/sign-up/admin', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['super-admin'],
    voters: [basicAuthorization],
  })
  async createAdmin(
    @requestBody(CredentialsRequestBody)
    newUserRequest: Credentials,
  ): Promise<User> {
    // ensure a valid email value and password value
    validateCredentials(_.pick(newUserRequest, ['email', 'password']));

    // encrypt the password
    const password = await this.passwordHasher.hashPassword(
      newUserRequest.password,
    );

    try {
      // create the new user
      const savedUser = await this.userRepository.create(
        _.omit(newUserRequest, 'password'),
      );

      // set the password
      await this.userRepository
        .userCredentials(savedUser.id)
        .create({password});

      return savedUser;
    } catch (error) {
      // MongoError 11000 duplicate key
      if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
        throw new HttpErrors.Conflict('Email value is already taken');
      } else {
        throw error;
      }
    }
  }

  @get('/users/{userId}', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['super-admin'],
    voters: [basicAuthorization],
  })
  async findById(@param.path.string('userId') userId: number): Promise<User> {
    return this.userRepository.findById(userId);
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['super-admin'],
    voters: [basicAuthorization],
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['super-admin'],
    voters: [basicAuthorization],
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @get('/users/me', {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User> {
    const userId = currentUserProfile[securityId];
    return this.userRepository.findById(userId);
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    const response = {user, token};

    return response;
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['super-admin'],
    voters: [basicAuthorization],
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
