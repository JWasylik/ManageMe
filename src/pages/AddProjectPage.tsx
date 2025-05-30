import { useNavigate } from "react-router-dom";
import { Project } from "../types/Project";
import { ProjectService } from "../services/ProjectService";
import { useState, useEffect } from "react";

const AddProjectPage = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isGuest, setIsGuest] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user.role === "guest") {
                    setIsGuest(true);
                    navigate("/projects");
                }
            } catch {
                setIsGuest(true);
            }
        } else {
            setIsGuest(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const newProject: Project = {
            id: Date.now().toString(),
            name,
            description,
        };

        try {
            await ProjectService.create(newProject);
            navigate("/projects");
        } catch (err) {
            console.error(err);
            setError("Wystąpił błąd podczas zapisywania projektu.");
        } finally {
            setLoading(false);
        }
    };

    if (isGuest) {
        return (
            <p className="text-red-500">
                ⛔ Dostęp tylko dla zalogowanych użytkowników z pełnymi uprawnieniami.
            </p>
        );
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-6">
            <h2 className="text-xl font-semibold mb-4">Dodaj projekt</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block font-medium mb-1">Nazwa:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block font-medium mb-1">Opis:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Zapisywanie..." : "Zapisz"}
                </button>
            </form>
        </div>
    );
};

export default AddProjectPage;
