import { Task } from "../types/Task";

const STORAGE_KEY = "tasks";

export class TaskService {
    static getAll(): Task[] {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    static getById(id: string): Task | undefined {
        return this.getAll().find(t => t.id === id);
    }

    static getByStory(storyId: string): Task[] {
        return this.getAll().filter(t => t.storyId === storyId);
    }

    static saveAll(tasks: Task[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    static create(task: Task): void {
        const tasks = this.getAll();
        tasks.push(task);
        this.saveAll(tasks);
    }

    static update(updated: Task): void {
        const tasks = this.getAll().map(t => t.id === updated.id ? updated : t);
        this.saveAll(tasks);
    }

    static delete(id: string): void {
        const tasks = this.getAll().filter(t => t.id !== id);
        this.saveAll(tasks);
    }
}
