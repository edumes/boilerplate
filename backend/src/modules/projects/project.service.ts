import { BaseService } from '@modules/base/base.service';
import { Project } from '@modules/projects/project.entity';
import { projectRepository } from '@modules/projects/project.repository';

export class ProjectService extends BaseService<Project> {
  constructor() {
    super(projectRepository, 'Project');

    this.setHooks({
      beforeCreate: async data => {},
    });
  }

  async findByCode(code: string): Promise<Project | null> {
    return projectRepository.findByCode(code);
  }
}

export const projectService = new ProjectService();
