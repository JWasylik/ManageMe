import { Story } from "../types/Story";

const STORAGE_KEY = "stories";

export class StoryService {
    static getAll(): Story[] {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    static getByProject(projectId: string): Story[] {
        return this.getAll().filter(s => s.projectId === projectId);
    }

    static getById(id: string): Story | undefined {
        return this.getAll().find(s => s.id === id);
    }

    static saveAll(stories: Story[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
    }

    static create(story: Story): void {
        const stories = this.getAll();
        stories.push(story);
        this.saveAll(stories);
    }

    static update(updated: Story): void {
        const stories = this.getAll().map(s => s.id === updated.id ? updated : s);
        this.saveAll(stories);
    }

    static delete(id: string): void {
        const stories = this.getAll().filter(s => s.id !== id);
        this.saveAll(stories);
    }
}
