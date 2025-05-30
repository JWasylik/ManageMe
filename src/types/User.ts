export type UserRole = "admin" | "developer" | "devops" | "guest";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}
