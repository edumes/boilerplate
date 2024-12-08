import { BaseService } from '../base/base.service';
import { Project } from './project.entity';
import { projectRepository } from './project.repository';

export class ProjectService extends BaseService<Project> {
  constructor() {
    super(projectRepository, 'Project');
  }

  async findByCode(code: string): Promise<Project | null> {
    return projectRepository.findByCode(code);
  }
}

export const projectService = new ProjectService();
