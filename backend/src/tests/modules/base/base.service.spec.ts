import { AppDataSource } from '@config/database.config';
import { Company } from '@modules/companies/company.model';
import { TestBaseService } from '@tests/helpers/base-service.helper';
import { FakeDataHelper } from '@tests/helpers/fake-data.helper';
import { Repository } from 'typeorm';

describe('BaseService', () => {
  let service: TestBaseService<Company>;
  let repository: Repository<Company>;

  beforeAll(async () => {
    repository = AppDataSource.getRepository(Company);
    service = new TestBaseService(repository);
  });

  beforeEach(async () => {
    // await repository.clear(); // Limpa o banco antes de cada teste
  });

  describe('create', () => {
    it('should create a new entity', async () => {
      const fakeCompany = FakeDataHelper.company();
      const created = await service.create(fakeCompany);

      expect(created).toBeDefined();
      expect(created.id).toBeDefined();
      expect(created.company_name).toBe(fakeCompany.company_name);
    });
  });

  describe('findById', () => {
    it('should find entity by id', async () => {
      const fakeCompany = FakeDataHelper.company();
      const created = await service.create(fakeCompany);
      const found = await service.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent id', async () => {
      const found = await service.findById(999999);
      expect(found).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing entity', async () => {
      const fakeCompany = FakeDataHelper.company();
      const created = await service.create(fakeCompany);

      const updateData = { company_name: 'Updated Name' };
      const updated = await service.update(created.id, updateData);

      expect(updated).toBeDefined();
      expect(updated?.company_name).toBe(updateData.company_name);
    });
  });

  describe('delete', () => {
    it('should delete an existing entity', async () => {
      const fakeCompany = FakeDataHelper.company();
      const created = await service.create(fakeCompany);

      await service.delete(created.id);
      const found = await service.findById(created.id);

      expect(found).toBeNull();
    });
  });

  describe('search', () => {
    it('should search entities by term', async () => {
      const company1 = await service.create(
        FakeDataHelper.company({ company_name: 'Test Company ABC' }),
      );
      await service.create(FakeDataHelper.company({ company_name: 'Another Company XYZ' }));

      const [results, total] = await service.search({
        searchFields: ['company_name'],
        searchTerm: 'ABC',
      });

      expect(results.length).toBe(1);
      expect(total).toBe(1);
      expect(results[0].id).toBe(company1.id);
    });
  });
});
