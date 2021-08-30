import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Filter, model, property, repository} from '@loopback/repository';
import {
  del,
  get,
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

// TBD: refactor the ACLs to a separate file
// const RESOURCE_NAME = 'project';
// const ACL_PROJECT = {
//   'signup-admin': {
//     resource: RESOURCE_NAME,
//     scopes: ['signup-admin'],
//     allowedRoles: ['owner'],
//     voters: [basicAuthorization],
//   },
//   'get-user-byId': {
//     resource: RESOURCE_NAME,
//     scopes: ['get-user-byId'],
//     allowedRoles: ['owner'],
//     voters: [basicAuthorization],
//   },
//   'patch-user-byId': {
//     resource: RESOURCE_NAME,
//     scopes: ['patch-user-byId'],
//     allowedRoles: ['owner'],
//     voters: [basicAuthorization],
//   },
//   'put-user-byId': {
//     resource: RESOURCE_NAME,
//     scopes: ['put-user-byId'],
//     allowedRoles: ['owner'],
//     voters: [basicAuthorization],
//   },
//   'delete-user-byId': {
//     resource: RESOURCE_NAME,
//     scopes: ['delete-user-byId'],
//     allowedRoles: ['owner'],
//     voters: [basicAuthorization],
//   },
// };

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

  @post('/users/sign-up/merchant', {
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
  // @authorize({
  //   allowedRoles: ['owner'],
  //   voters: [basicAuthorization],
  // })
  async createAdmin(
    @requestBody(CredentialsRequestBody)
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    newUserRequest: Credentials,
  ): Promise<User> {
    newUserRequest.role = 'merchant';
    // current user to ensure just the owner have acsess here
    const userId = currentUserProfile[securityId];
    const currenrUser = this.userRepository.findById(userId);
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

      if ((await currenrUser).role == 'owner') {
        return savedUser;
      } else {
        throw new HttpErrors.Forbidden('acces denied');
      }
    } catch (error) {
      // MongoError 11000 duplicate key
      if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
        throw new HttpErrors.Conflict('Email value is already taken');
      } else {
        throw error;
      }
    }
  }

  @get('/usersList', {
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
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @get('/users/{id}', {
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
  // @authorize({
  // deniedRoles: ['user'],
  // voters: [basicAuthorization],
  // })
  async findById(@param.path.string('id') id: number): Promise<User> {
    return this.userRepository.findById(id);
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async UpdateById(
    @param.path.number('id') id: number,
    @requestBody() user: User,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    try {
      const userId = currentUserProfile[securityId];
      const currenrUser = this.userRepository.findById(userId);
      const updateUser = this.userRepository.updateById(id, user);
      if ((await currenrUser).role == 'owner') {
        updateUser;
      } else {
        throw new HttpErrors.Forbidden('acces denied');
      }
    } catch (err) {
      console.log(err);
    }
  }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  @authenticate('jwt')
  // @authorize({
  //   allowedRoles: ['owner'],
  //   voters: [basicAuthorization],
  // })
  async replaceById(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody() user: User,
  ): Promise<void> {
    try {
      const userId = currentUserProfile[securityId];
      const currenrUser = this.userRepository.findById(userId);
      const replaceUser = this.userRepository.replaceById(id, user);
      if ((await currenrUser).role == 'owner') {
        replaceUser;
      } else {
        throw new HttpErrors.Forbidden('acces denied');
      }
    } catch (err) {
      console.log(err);
    }
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
  // @authorize({
  //   allowedRoles: ['owner'],
  //   voters: [basicAuthorization],
  // })
  async deleteById(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    try {
      const userId = currentUserProfile[securityId];
      const currenrUser = this.userRepository.findById(userId);
      const deleteUser = this.userRepository.deleteById(id);
      if ((await currenrUser).role == 'owner') {
        deleteUser;
      } else {
        throw new HttpErrors.Forbidden('acces denied');
      }
    } catch (err) {
      console.log(err);
    }
  }
}
