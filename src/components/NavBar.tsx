import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User as LocalUser } from "../types/User";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { UserService } from "../services/UserService";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";


type Props = {
    onToggleTheme: () => void;
};

const NavBar = ({ onToggleTheme }: Props) => {
    const [user, setUser] = useState<LocalUser | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userData = await UserService.getById(firebaseUser.uid);
                setUser(userData ?? null);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                    <Link to="/">ManageMe</Link>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                        <Link className="hover:text-blue-600 dark:hover:text-blue-400" to="/">
                            Strona główna
                        </Link>

                        {user ? (
                            <>
                                <Link className="hover:text-blue-600 dark:hover:text-blue-400" to="/projects">
                                    Projekty
                                </Link>
                                {user.role !== "guest" && (
                                    <Link className="hover:text-blue-600 dark:hover:text-blue-400" to="/projects/add">
                                        Dodaj projekt
                                    </Link>
                                )}
                                <Link className="hover:text-blue-600 dark:hover:text-blue-400" to="/stories">
                                    Historyjki
                                </Link>
                                <Link className="hover:text-blue-600 dark:hover:text-blue-400" to="/tasks/board">
                                    Zadania
                                </Link>
                                <Link
                                    to="/logout"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
                                >
                                    Wyloguj się
                                </Link>
                            </>
                        ) : (
                            <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400">
                                Zaloguj się
                            </Link>
                        )}
                    </div>

                    {/* User info */}
                    {user && (
                        <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                            👋 {user.firstName} {user.lastName}
                        </span>
                    )}

                    {/* Dark/Light switch */}
                    <button
                        onClick={onToggleTheme}
                        className="p-2 rounded bg-gray-100 dark:bg-gray-800 hover:ring-2 hover:ring-blue-300 transition"
                        aria-label="Przełącz motyw"
                    >
                        <SunIcon className="w-5 h-5 text-yellow-400 dark:hidden" />
                        <MoonIcon className="w-5 h-5 hidden dark:inline-block text-white" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
