import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Project } from "../types/Project";
import { ProjectService } from "../services/ProjectService";

const EditProjectPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const p = await ProjectService.getById(id!);
                if (p) {
                    setProject(p);
                } else {
                    setError("Projekt nie został znaleziony.");
                }
            } catch {
                setError("Błąd podczas wczytywania projektu.");
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!project) return;
        setSaving(true);
        setError(null);
        try {
            await ProjectService.update(project);
            navigate("/projects");
        } catch {
            setError("Błąd podczas zapisywania zmian.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="text-gray-600 dark:text-gray-300">⏳ Ładowanie...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!project) return null;

    return (
        <div className="max-w-xl mx-auto px-4 py-6">
            <h2 className="text-xl font-semibold mb-4">Edytuj projekt</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block font-medium mb-1">Nazwa:</label>
                    <input
                        type="text"
                        id="name"
                        value={project.name}
                        onChange={e => setProject({ ...project, name: e.target.value })}
                        required
                        className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block font-medium mb-1">Opis:</label>
                    <textarea
                        id="description"
                        value={project.description}
                        onChange={e => setProject({ ...project, description: e.target.value })}
                        rows={4}
                        required
                        className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {saving ? "Zapisywanie..." : "Zapisz"}
                </button>
            </form>
        </div>
    );
};

export default EditProjectPage;
