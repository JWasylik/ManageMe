import { Project } from "../types/Project";

const STORAGE_KEY = "projects";

export class ProjectService {
    static getAll(): Project[] {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    static saveAll(projects: Project[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }

    static create(project: Project): void {
        const projects = this.getAll();
        projects.push(project);
        this.saveAll(projects);
    }

    static update(updatedProject: Project): void {
        const projects = this.getAll().map(p =>
            p.id === updatedProject.id ? updatedProject : p
        );
        this.saveAll(projects);
    }

    static delete(id: string): void {
        const projects = this.getAll().filter(p => p.id !== id);
        this.saveAll(projects);
    }

    static getById(id: string): Project | undefined {
        return this.getAll().find(p => p.id === id);
    }
}
