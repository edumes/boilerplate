import { AppDataSource } from '@config/database.config';
import { BaseRepository } from '@modules/base/base.repository';
import { Client } from './client.model';

export class ClientRepository extends BaseRepository<Client> {
  constructor() {
    super(Client, AppDataSource);
  }
}

export const clientRepository = new ClientRepository();
