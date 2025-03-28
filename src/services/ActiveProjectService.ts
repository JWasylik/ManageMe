export class ActiveProjectService {
    private static KEY = "activeProjectId";

    static setActiveProjectId(id: string): void {
        localStorage.setItem(this.KEY, id);
    }

    static getActiveProjectId(): string | null {
        return localStorage.getItem(this.KEY);
    }

    static clear(): void {
        localStorage.removeItem(this.KEY);
    }
}
