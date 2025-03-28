import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Story, Priority, Status } from "../types/Story";
import { StoryService } from "../services/StoryService";
import { ActiveProjectService } from "../services/ActiveProjectService";

const StoryAddPage = () => {
    const navigate = useNavigate();
    const projectId = ActiveProjectService.getActiveProjectId();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>("medium");
    const [status, setStatus] = useState<Status>("todo");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!projectId) {
            alert("Brak aktywnego projektu. Wybierz projekt przed dodaniem historyjki.");
            return;
        }

        const newStory: Story = {
            id: Date.now().toString(),
            name,
            description,
            priority,
            status,
            projectId,
            createdAt: new Date().toISOString(),
            ownerId: "",
        };

        StoryService.create(newStory);
        navigate("/stories");
    };

    return (
        <div>
            <h2>Dodaj historyjkę</h2>
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

                <div className="form-group">
                    <label htmlFor="priority">Priorytet:</label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Priority)}
                    >
                        <option value="low">Niski</option>
                        <option value="medium">Średni</option>
                        <option value="high">Wysoki</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Status)}
                    >
                        <option value="todo">Do zrobienia</option>
                        <option value="doing">W trakcie</option>
                        <option value="done">Zrobione</option>
                    </select>
                </div>

                <button type="submit">Zapisz</button>
            </form>
        </div>
    );
};

export default StoryAddPage;
