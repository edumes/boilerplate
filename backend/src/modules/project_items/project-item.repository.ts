import { AppDataSource } from '@config/database.config';
import { BaseRepository } from '@modules/base/base.repository';
import { ProjectItem } from './project-item.model';

export class ProjectItemsRepository extends BaseRepository<ProjectItem> {
  constructor() {
    super(ProjectItem, AppDataSource);
  }
}

export const projectItemsRepository = new ProjectItemsRepository();
