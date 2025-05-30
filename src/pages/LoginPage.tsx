import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    getAuth,
} from "firebase/auth";
import { app, db } from "../services/firebase";
import { UserService } from "../services/UserService";
import { doc, getDoc, setDoc } from "firebase/firestore";

const auth = getAuth(app);

const LoginPage = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const cred = await signInWithEmailAndPassword(auth, login, password);
            const user = cred.user;

            const fullUser = await UserService.getById(user.uid);
            if (fullUser) {
                localStorage.setItem("user", JSON.stringify(fullUser));
                window.dispatchEvent(new Event("userChanged"));
                navigate("/");
            } else {
                setError("Nie znaleziono danych użytkownika w bazie.");
            }
        } catch {
            setError("Nieprawidłowe dane logowania.");
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        const provider = new GoogleAuthProvider();

        try {
            const cred = await signInWithPopup(auth, provider);
            const user = cred.user;

            const userDocRef = doc(db, "users", user.uid);
            const snapshot = await getDoc(userDocRef);

            if (!snapshot.exists()) {
                await setDoc(userDocRef, {
                    email: user.email || "",
                    firstName: user.displayName?.split(" ")[0] || "Gość",
                    lastName: user.displayName?.split(" ")[1] || "",
                    role: "guest",
                });
            }

            const userSettingsRef = doc(db, "userSettings", user.uid);
            const userSettingsSnapshot = await getDoc(userSettingsRef);
            if (!userSettingsSnapshot.exists()) {
                await setDoc(userSettingsRef, {
                    activeProjectId: "",
                });
            }

            const fullUser = await UserService.getById(user.uid);
            if (fullUser) {
                localStorage.setItem("user", JSON.stringify(fullUser));
                window.dispatchEvent(new Event("userChanged"));
                navigate("/");
            } else {
                setError("Nie znaleziono danych użytkownika w bazie.");
            }
        } catch (err) {
            console.error("Błąd logowania przez Google:", err);
            setError("Błąd logowania przez Google");
        }
    };

    return (
        <div>
            <h2>Logowanie</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="login">Email: </label>
                    <input
                        id="login"
                        type="email"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Hasło: </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Zaloguj się
                    </button>
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                        Zaloguj się przez Google
                    </button>
                </div>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;
