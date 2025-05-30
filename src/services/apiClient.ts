import { getAuth } from "firebase/auth";

export function getCurrentUser() {
    const auth = getAuth();
    return auth.currentUser;
}
