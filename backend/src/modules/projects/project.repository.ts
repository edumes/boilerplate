import { AppDataSource } from '@config/database';
import { BaseRepository } from '@modules/base/base.repository';
import { Project } from '@modules/projects/project.entity';

export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super(Project, AppDataSource);
  }

  async findByCode(code: string): Promise<Project | null> {
    return this.findOne({
      where: { project_code: code },
    });
  }
}

export const projectRepository = new ProjectRepository();
