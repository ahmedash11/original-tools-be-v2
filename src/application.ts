import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  JWTAuthenticationStrategy,
  JWTService,
  MyUserService,
  SECURITY_SCHEME_SPEC,
  TokenServiceBindings,
  TokenServiceConstants,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {AuthorizationComponent} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {OpenApiSpec, RestApplication, RestBindings} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import * as dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import {
  FILE_UPLOAD_SERVICE,
  PasswordHasherBindings,
  STORAGE_DIRECTORY,
} from './keys';
import {MySequence} from './sequence';
import {BcryptHasher} from './services';
import {SECURITY_SPEC} from './utils/security-spec';

export {ApplicationConfig};

export class TestApp extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    dotenv.config({path: '.env'});

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    this.bind(RestBindings.REQUEST_BODY_PARSER_OPTIONS).to({
      validation: {coerceTypes: true},
    });

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(AuthorizationComponent);
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);

    this.add(createBindingFromClass(JWTAuthenticationStrategy));
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);

    // Configure file upload with multer options
    this.configureFileUpload(options.fileStorageDirectory);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.setUpBindings();

    const spec: OpenApiSpec = {
      openapi: '3.0.0',
      info: {title: 'pkg.name', version: 'pkg.version'},
      paths: {},
      components: {securitySchemes: SECURITY_SCHEME_SPEC},
      servers: [{url: '/api'}],
      security: SECURITY_SPEC,
    };
    this.api(spec);
  }
  /**
   * Configure `multer` options for file upload
   */
  protected configureFileUpload(destination?: string) {
    // Upload files to `dist/.sandbox` by default
    destination =
      process.env.NODE_ENV === 'PRODUCTION'
        ? `/media/uploads/images`
        : __dirname;
    this.bind(STORAGE_DIRECTORY).to(destination);
    const multerOptions: multer.Options = {
      storage: multer.diskStorage({
        destination,
        // Use the original file name as is
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    };
    // Configure the file upload service with multer options
    this.configure(FILE_UPLOAD_SERVICE).to(multerOptions);
  }

  private setUpBindings(): void {
    // Bind package.json to the application context
    // this.bind(PackageKey).to(pkg);

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    // Bind bcrypt hash services
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    // Bind user service
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
  }
}
