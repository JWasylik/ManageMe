
import { db } from "../services/firebase";
import {
    collection,
    getDocs,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    getDoc,
} from "firebase/firestore";
import { Project } from "../types/Project";
import { getAuth } from "firebase/auth";
import { UserSettingsService } from "./UserSettingsService";

const COLLECTION_NAME = "projects";

export class ProjectService {
    static async getAll(): Promise<Project[]> {
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Project));
    }

    static async create(project: Project): Promise<void> {
        await setDoc(doc(db, COLLECTION_NAME, project.id), project);
    }

    static async update(updatedProject: Project): Promise<void> {
        const { id, ...projectData } = updatedProject;
        await updateDoc(doc(db, COLLECTION_NAME, id), projectData);
    }

    static async delete(id: string): Promise<void> {
        await deleteDoc(doc(db, COLLECTION_NAME, id));

        const currentUser = getAuth().currentUser;
        if (!currentUser) return;

        const activeProjectId = await UserSettingsService.getActiveProjectId(currentUser.uid);
        if (activeProjectId === id) {
            await UserSettingsService.clearActiveProjectId(currentUser.uid);
        }
    }

    static async getById(id: string): Promise<Project | undefined> {
        const snapshot = await getDoc(doc(db, COLLECTION_NAME, id));
        if (!snapshot.exists()) return undefined;
        return { id: snapshot.id, ...snapshot.data() } as Project;
    }
}
