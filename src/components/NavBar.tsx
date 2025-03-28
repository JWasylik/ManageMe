import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../types/User";


const NavBar = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const updateUser = () => {
            const stored = localStorage.getItem("user");
            if (stored) {
                try {
                    setUser(JSON.parse(stored));
                } catch (e) {
                    console.error("Błąd parsowania użytkownika:", e);
                }
            } else {
                setUser(null);
            }
        };

        updateUser();
        window.addEventListener("userChanged", updateUser);

        return () => {
            window.removeEventListener("userChanged", updateUser);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);


        window.dispatchEvent(new Event("userChanged"));
        navigate("/login");
    };

    return (
        <div style={{ marginBottom: "1rem" }}>
            {user && (
                <p>
                    Zalogowany jako: {user.firstName} {user.lastName} ({user.role})
                </p>
            )}
            <nav>
                <Link to="/">🏠 Strona główna</Link>{" "}
                <Link to="/projects">📁 Projekty</Link>{" "}
                <Link to="/projects/add">🆕 Dodaj projekt</Link>{" "}
                <Link to="/stories">📖 Historyjki</Link>{" "}
                {!user ? (
                    <Link to="/login">🔐 Zaloguj się</Link>
                ) : (
                    <Link
                        to="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleLogout();
                        }}
                        style={{
                            color: "#3b82f6",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            marginLeft: "0.5rem"
                        }}
                    >
                        ⬅️ Wyloguj się
                    </Link>
                )}
            </nav>
        </div>
    );
};

export default NavBar;
