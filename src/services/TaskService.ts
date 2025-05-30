import { Task } from "../types/Task";
import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    deleteDoc,
    updateDoc,
    query,
    where,
} from "firebase/firestore";
import { db } from "../services/firebase";

const COLLECTION = "tasks";

export class TaskService {
    static async getAll(): Promise<Task[]> {
        const snapshot = await getDocs(collection(db, COLLECTION));
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Task[];
    }

    static async getById(id: string): Promise<Task | undefined> {
        const ref = doc(db, COLLECTION, id);
        const snapshot = await getDoc(ref);
        if (!snapshot.exists()) return undefined;
        return { ...snapshot.data(), id: snapshot.id } as Task;
    }

    static async getByStory(storyId: string): Promise<Task[]> {
        const q = query(collection(db, COLLECTION), where("storyId", "==", storyId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Task[];
    }

    static async create(task: Task): Promise<void> {
        const ref = doc(db, COLLECTION, task.id);
        await setDoc(ref, task);
    }

    static async update(updated: Task): Promise<void> {
        const ref = doc(db, COLLECTION, updated.id);
        await updateDoc(ref, { ...updated });
    }

    static async delete(id: string): Promise<void> {
        await deleteDoc(doc(db, COLLECTION, id));
    }
}
