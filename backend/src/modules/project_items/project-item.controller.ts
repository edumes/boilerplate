import { BaseController } from '@modules/base/base.controller';
import { ProjectItem } from './project-item.model';
import { projectItemsService } from './project-item.service';

export class ProjectItemsController extends BaseController<ProjectItem> {
  constructor() {
    super(projectItemsService);
  }
}

export const projectItemsController = new ProjectItemsController();
