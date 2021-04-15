import {AuthenticationComponent} from '@loopback/authentication';
import {JWTAuthenticationComponent} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, RestBindings} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import * as dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import {FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY} from './keys';
import {MySequence} from './sequence';


export {ApplicationConfig};

export class TestApp extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    dotenv.config({ path: '.env' });
  console.log({process:process.env.MerchantCode});


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

    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);

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
}
