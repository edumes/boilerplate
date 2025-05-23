import { BaseService } from '@modules/base/base.service';
import { Project } from '@modules/projects/project.model';
import { projectRepository } from '@modules/projects/project.repository';

export class ProjectService extends BaseService<Project> {
  constructor() {
    super(projectRepository, 'Project');

    this.setHooks({
      beforeCreate: async data => {},
      defineRelationFields: defaultRelations => {
        return [...defaultRelations, 'project_items'];
      }
    });
  }

  async findByCode(code: string): Promise<Project | null> {
    return projectRepository.findByCode(code);
  }
}

export const projectService = new ProjectService();
