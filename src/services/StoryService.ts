import { Story } from "../types/Story";
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
import { db } from "../services/firebase"; // Zakładam, że masz `db` zdefiniowane

const COLLECTION = "stories";

export class StoryService {
    static async getAll(): Promise<Story[]> {
        const snapshot = await getDocs(collection(db, COLLECTION));
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Story[];
    }

    static async getByProject(projectId: string): Promise<Story[]> {
        const q = query(collection(db, COLLECTION), where("projectId", "==", projectId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Story[];
    }

    static async getById(id: string): Promise<Story | undefined> {
        const docRef = doc(db, COLLECTION, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return undefined;
        return { ...snapshot.data(), id: snapshot.id } as Story;
    }

    static async create(story: Story): Promise<void> {
        const docRef = doc(db, COLLECTION, story.id);
        await setDoc(docRef, story);
    }

    static async update(story: Story): Promise<void> {
        const docRef = doc(db, COLLECTION, story.id);
        await updateDoc(docRef, { ...story });
    }

    static async delete(id: string): Promise<void> {
        await deleteDoc(doc(db, COLLECTION, id));
    }
}
