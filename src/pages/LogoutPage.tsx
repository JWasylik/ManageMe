import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../services/firebase";

const Logout = () => {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const auth = getAuth(app);

    useEffect(() => {
        setShowConfirm(true);
    }, []);

    const confirmLogout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.warn("Błąd podczas wylogowywania z Firebase:", err);
        }

        localStorage.removeItem("user");
        window.dispatchEvent(new Event("userChanged"));
        navigate("/login");
    };

    const cancelLogout = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            {showConfirm && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Czy na pewno chcesz się wylogować?
                    </h2>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={cancelLogout}
                            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            Anuluj
                        </button>
                        <button
                            onClick={confirmLogout}
                            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                        >
                            Tak, wyloguj
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Logout;
