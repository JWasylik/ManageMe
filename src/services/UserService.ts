import { User } from "../types/User";

export class UserService {
    private static users: User[] = [
        {
            id: "u1",
            firstName: "Jan",
            lastName: "Kowalski",
            role: "admin"
        },
        {
            id: "u2",
            firstName: "Agnieszka",
            lastName: "Nowak",
            role: "developer"
        },
        {
            id: "u3",
            firstName: "Tomasz",
            lastName: "Wiśniewski",
            role: "devops"
        }
    ];

    static getLoggedInUser(): User {
        return this.users[0];
    }

    static getAllUsers(): User[] {
        return this.users;
    }

    static getUserById(id: string): User | undefined {
        return this.users.find(user => user.id === id);
    }
}
