import { BaseController } from '@modules/base/base.controller';
import { Client } from './client.model';
import { clientService } from './client.service';

export class ClientController extends BaseController<Client> {
  constructor() {
    super(clientService);
  }
}

export const clientController = new ClientController();
