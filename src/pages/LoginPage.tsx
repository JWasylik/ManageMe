import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ login, password })
            });

            if (!res.ok) {
                const message = await res.text();
                throw new Error(message || "Błąd logowania");
            }

            const { token, refreshToken } = await res.json();
            localStorage.setItem("token", token);
            localStorage.setItem("refreshToken", refreshToken);

            const userRes = await fetch("http://localhost:3000/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const userData = await userRes.json();
            localStorage.setItem("user", JSON.stringify(userData));
            window.dispatchEvent(new Event("userChanged"));

            navigate("/");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Błąd logowania");
            }
        }
    };

    return (
        <div>
            <h2>Logowanie</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Login:</label>
                    <input
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Hasło:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Zaloguj się</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;
