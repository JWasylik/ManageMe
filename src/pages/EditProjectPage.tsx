import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Project } from "../types/Project";
import { ProjectService } from "../services/ProjectService";

const EditProjectPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        const p = ProjectService.getById(id!);
        if (p) setProject(p);
    }, [id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (project) {
            ProjectService.update(project);
            navigate("/projects");
        }
    };

    if (!project) return <p>Ładowanie...</p>;

    return (
        <div>
            <h2>Edytuj projekt</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nazwa:</label>
                    <input
                        value={project.name}
                        onChange={e => setProject({ ...project, name: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Opis:</label>
                    <textarea
                        value={project.description}
                        onChange={e => setProject({ ...project, description: e.target.value })}
                        required
                    />
                </div>
                <button type="submit">Zapisz</button>
            </form>
        </div>
    );
};

export default EditProjectPage;
