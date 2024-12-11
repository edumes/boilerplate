import { faker } from '@faker-js/faker';
import { Company } from '@modules/companies/company.model';
import { User } from '@modules/users/user.model';
import { DeepPartial } from 'typeorm';

export class FakeDataHelper {
  static company(override: Partial<Company> = {}): DeepPartial<Company> {
    return {
      company_name: faker.company.name(),
      company_cnpj: faker.string.numeric(14),
      company_address: faker.location.streetAddress(),
      company_telephone: faker.phone.number(),
      company_email: faker.internet.email(),
      ...override,
    };
  }

  static user(override: Partial<User> = {}): DeepPartial<User> {
    return {
      user_name: faker.person.fullName(),
      user_email: faker.internet.email(),
      user_password: faker.internet.password(),
      ...override,
    };
  }
}
