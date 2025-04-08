import { BaseController } from '@modules/base/base.controller';
import { Project } from '@modules/projects/project.model';
import { projectService } from '@modules/projects/project.service';

export class ProjectController extends BaseController<Project> {
  constructor() {
    super(projectService);
  }
}

export const projectController = new ProjectController();
