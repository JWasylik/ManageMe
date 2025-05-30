import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export class UserSettingsService {
    static async getActiveProjectId(userId: string): Promise<string | null> {
        const docRef = doc(db, "userSettings", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().activeProjectId ?? null;
        }
        return null;
    }

    static async setActiveProjectId(userId: string, projectId: string): Promise<void> {
        const ref = doc(db, "userSettings", userId);
        await setDoc(ref, { activeProjectId: projectId }, { merge: true });
    }

    static async clearActiveProjectId(userId: string): Promise<void> {
        const ref = doc(db, "userSettings", userId);
        await updateDoc(ref, { activeProjectId: "" });
    }
}
