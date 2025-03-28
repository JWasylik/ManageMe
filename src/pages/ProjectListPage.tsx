import { useEffect, useState } from "react";
import { Project } from "../types/Project";
import { ProjectService } from "../services/ProjectService";
import { ActiveProjectService } from "../services/ActiveProjectService";
import { Link } from "react-router-dom";

interface Props {
    onSetActiveProject: (id: string) => void;
}

const ProjectListPage = ({ onSetActiveProject }: Props) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(ActiveProjectService.getActiveProjectId());

    useEffect(() => {
        setProjects(ProjectService.getAll());
    }, []);

    const handleDelete = (id: string) => {
        ProjectService.delete(id);
        setProjects(ProjectService.getAll());
    };

    const handleSetActive = (id: string) => {
        onSetActiveProject(id);
        setActiveProjectId(id);
    };

    return (
        <div>
            <h2>Lista projektów</h2>
            {projects.length === 0 ? (
                <p>Brak projektów</p>
            ) : (
                <ul>
                    {projects.map((project) => (
                        <li key={project.id}>
                            <strong>{project.name}</strong> - {project.description}
                            {" | "}
                            <Link to={`/projects/edit/${project.id}`}>Edytuj</Link>
                            {" | "}
                            <button onClick={() => handleDelete(project.id)}>Usuń</button>
                            {" "}
                            <button onClick={() => handleSetActive(project.id)}>Ustaw jako aktywny</button>
                            {activeProjectId === project.id && <span> ✅ (aktywny)</span>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProjectListPage;
