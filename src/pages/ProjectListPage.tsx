import { useEffect, useState } from "react";
import { Project } from "../types/Project";
import { ProjectService } from "../services/ProjectService";
import { UserSettingsService } from "../services/UserSettingsService";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";

const ProjectListPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | undefined>(undefined);

    const user = getAuth().currentUser;

    useEffect(() => {
        const loadData = async () => {
            try {
                const allProjects = await ProjectService.getAll();
                setProjects(allProjects);

                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    try {
                        const parsed = JSON.parse(storedUser);
                        setUserRole(parsed.role);
                    } catch {
                        setUserRole(undefined);
                    }
                }

                if (user) {
                    const projectId = await UserSettingsService.getActiveProjectId(user.uid);
                    setActiveProjectId(projectId);
                }
            } catch (err) {
                console.error("Błąd podczas ładowania projektów:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user]);

    const handleDelete = async (id: string) => {
        try {
            await ProjectService.delete(id);
            const updatedProjects = await ProjectService.getAll();
            setProjects(updatedProjects);
        } catch (err) {
            console.error("Błąd podczas usuwania projektu:", err);
        }
    };

    const handleSetActive = async (id: string) => {
        if (!user) return;
        try {
            await UserSettingsService.setActiveProjectId(user.uid, id);
            setActiveProjectId(id);
        } catch (err) {
            console.error("Błąd podczas ustawiania aktywnego projektu:", err);
        }
    };

    return (
        <div>
            <h2>Lista projektów</h2>

            {userRole !== "guest" && (
                <div style={{ marginBottom: "1rem" }}>
                    <Link to="/projects/add">➕ Dodaj projekt</Link>
                </div>
            )}

            {loading && <p>Ładowanie projektów...</p>}

            {!loading && projects.length === 0 && <p>Brak projektów</p>}

            {!loading && projects.length > 0 && (
                <ul>
                    {projects.map((project) => (
                        <li key={project.id}>
                            <strong>{project.name}</strong> - {project.description}
                            {" | "}
                            {userRole !== "guest" && (
                                <>
                                    <Link to={`/projects/edit/${project.id}`}>Edytuj</Link>
                                    {" | "}
                                    <button onClick={() => handleDelete(project.id)}>Usuń</button>
                                    {" | "}
                                </>
                            )}
                            <button onClick={() => handleSetActive(project.id)}>
                                Ustaw jako aktywny
                            </button>
                            {activeProjectId === project.id && <span> ✅ (aktywny)</span>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProjectListPage;
