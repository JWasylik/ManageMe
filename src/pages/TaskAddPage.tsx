import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Story, Priority, Status } from "../types/Story";
import { StoryService } from "../services/StoryService";
import { ActiveProjectService } from "../services/ActiveProjectService";
import { UserService } from "../services/UserService";
import { User } from "../types/User";

const StoryAddPage = () => {
    const navigate = useNavigate();
    const projectId = ActiveProjectService.getActiveProjectId();
    const [users, setUsers] = useState<User[]>([]);
    const [ownerId, setOwnerId] = useState("");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>("medium");
    const [status, setStatus] = useState<Status>("todo");

    useEffect(() => {
        setUsers(UserService.getAllUsers());
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!projectId) {
            alert("Brak aktywnego projektu. Wybierz projekt przed dodaniem historyjki.");
            return;
        }

        if (status === "doing" && !ownerId) {
            alert("Dla statusu 'doing' musisz wybrać użytkownika.");
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
            ownerId: status === "doing" ? ownerId : "",
            startDate: status === "doing" ? new Date().toISOString() : undefined,
        };

        StoryService.create(newStory);
        navigate("/stories");
    };

    return (
        <div>
            <h2>Dodaj historyjkę</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nazwa:</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Opis:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Priorytet:</label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Priority)}
                    >
                        <option value="low">Niski</option>
                        <option value="medium">Średni</option>
                        <option value="high">Wysoki</option>
                    </select>
                </div>

                <div>
                    <label>Status:</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Status)}
                    >
                        <option value="todo">Do zrobienia</option>
                        <option value="doing">W trakcie</option>
                        <option value="done">Zrobione</option>
                    </select>
                </div>

                {status === "doing" && (
                    <div>
                        <label>Wybierz użytkownika:</label>
                        <select
                            value={ownerId}
                            onChange={(e) => setOwnerId(e.target.value)}
                            required
                        >
                            <option value="">-- wybierz --</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.firstName} {user.lastName} ({user.role})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button type="submit">Zapisz</button>
            </form>
        </div>
    );
};

export default StoryAddPage;
