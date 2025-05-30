import { User } from "../types/User";
import {
    collection,
    doc,
    getDoc,
    getDocs,
} from "firebase/firestore";
import { db } from "../services/firebase";

const COLLECTION = "users";

export class UserService {
    static async getAllUsers(): Promise<User[]> {
        const snapshot = await getDocs(collection(db, COLLECTION));
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
    }

    static async getById(id: string): Promise<User | undefined> {
        const ref = doc(db, COLLECTION, id);
        const snapshot = await getDoc(ref);
        if (!snapshot.exists()) return undefined;
        return { ...snapshot.data(), id: snapshot.id } as User;
    }

    static getLoggedInUser(): User | null {
        const stored = localStorage.getItem("user");
        if (!stored) return null;
        try {
            return JSON.parse(stored);
        } catch {
            return null;
        }
    }
}
