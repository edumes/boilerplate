import { BaseController } from '@modules/base/base.controller';
import { companyService } from '@modules/companies/company.service';
import { Project } from '@modules/projects/project.entity';
import { projectService } from '@modules/projects/project.service';
import { ApiResponseBuilder } from '@utils/api-response.util';
import { ValidationError } from '@utils/errors';
import { FastifyReply, FastifyRequest } from 'fastify';

export class ProjectController extends BaseController<Project> {
  constructor() {
    super(projectService);
  }

  async create(request: FastifyRequest<{ Body: Partial<Project> }>, reply: FastifyReply) {
    const projectData = request.body;

    if (!projectData.project_fk_company_id) {
      throw new ValidationError('Company ID is required');
    }

    const company = await companyService.findById(projectData.project_fk_company_id);
    if (!company) {
      throw new ValidationError('Company not found');
    }

    if (projectData.project_code) {
      const existingProject = await projectService.findByCode(projectData.project_code);
      if (existingProject) {
        throw new ValidationError('Project code already exists');
      }
    }

    const newProject = await super.create(request, reply);
    return reply.status(201).send(ApiResponseBuilder.success(newProject));
  }
}

export const projectController = new ProjectController();
