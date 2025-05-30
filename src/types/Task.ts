export type TaskStatus = "todo" | "doing" | "done";
export type Priority = "low" | "medium" | "high";

export interface Task {
    id: string;
    name: string;
    description: string;
    priority: Priority;
    storyId: string;
    estimatedHours: number;
    status: TaskStatus;
    createdAt: string;
    startDate?: string;
    endDate?: string;
    assignedUserId?: string;
}
