import { BaseService } from '@modules/base/base.service';
import { Client } from './client.model';
import { clientRepository } from './client.repository';

export class ClientService extends BaseService<Client> {
  constructor() {
    super(clientRepository, 'Client');

    this.setHooks({
      beforeCreate: async data => {}
    });
  }
}

export const clientService = new ClientService();
