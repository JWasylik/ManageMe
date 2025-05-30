export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "doing" | "done";

export interface Story {
    id: string;
    name: string;
    description: string;
    priority: "low" | "medium" | "high";
    status: "todo" | "doing" | "done";
    projectId: string;
    createdAt: string;
    ownerId: string;
    startDate?: string;
    endDate?: string;
}
