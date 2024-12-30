import { BaseService } from "./BaseService";

class ProjectService extends BaseService<any> {
    constructor() {
        super('/projects');
    }

    async getProjectsByStatus(status: string): Promise<any[]> {
        const response = await this.http.get<any[]>(`${this.endpoint}?project_status=${status}`);
        return response.data;
    }
}

export const projectService = new ProjectService();
