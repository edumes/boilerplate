import { AppDataSource } from '@config/database.config';
import { BaseRepository } from '@modules/base/base.repository';
import { Project } from '@modules/projects/project.model';

export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super(Project, AppDataSource);
  }

  async findByCode(code: string): Promise<Project | null> {
    return this.findOne({
      where: { project_code: code }
    });
  }
}

export const projectRepository = new ProjectRepository();
