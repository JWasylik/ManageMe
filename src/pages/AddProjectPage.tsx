import { useNavigate } from "react-router-dom";
import { Project } from "../types/Project";
import { ProjectService } from "../services/ProjectService";
import { useState } from "react";

const AddProjectPage = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newProject: Project = {
            id: Date.now().toString(),
            name,
            description
        };
        ProjectService.create(newProject);
        navigate("/projects");
    };

    return (
        <div>
            <h2>Dodaj projekt</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Nazwa:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Opis:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />
                </div>

                <button type="submit">Zapisz</button>
            </form>
        </div>
    );
};

export default AddProjectPage;
