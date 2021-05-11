import {UserCredentialsRepository} from '@loopback/authentication-jwt';
import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserCredentials, UserRelations} from '../models';

export type Credentials = {
  email: string;
  password: string;
  role?: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<
      UserCredentialsRepository
    >,
  ) {
    super(User, dataSource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userCredentials',
      this.userCredentials.inclusionResolver,
    );
  }
  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
