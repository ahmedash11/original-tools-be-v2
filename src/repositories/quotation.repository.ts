import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Customer, Quotation, QuotationRelations} from '../models';
import {CustomerRepository} from './customer.repository';

export class QuotationRepository extends DefaultCrudRepository<
  Quotation,
  typeof Quotation.prototype.id,
  QuotationRelations
> {
  public readonly customer: BelongsToAccessor<
    Customer,
    typeof Quotation.prototype.id
  >;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('CustomerRepository')
    protected customerRepositoryGetter: Getter<CustomerRepository>,
  ) {
    super(Quotation, dataSource);
    this.customer = this.createBelongsToAccessorFor(
      'customer',
      this.customerRepositoryGetter,
    );
    this.registerInclusionResolver('customer', this.customer.inclusionResolver);
  }
}
