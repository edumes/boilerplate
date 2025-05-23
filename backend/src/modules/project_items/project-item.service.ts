import { BaseService } from '@modules/base/base.service';
import { ProjectItem } from './project-item.model';
import { projectItemsRepository } from './project-item.repository';

export class ProjectItemsService extends BaseService<ProjectItem> {
  constructor() {
    super(projectItemsRepository, 'ProjectItems');

    this.setHooks({
      beforeCreate: async data => {}
    });
  }
}

export const projectItemsService = new ProjectItemsService();
