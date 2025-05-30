import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Story, Priority, Status } from "../types/Story";
import { StoryService } from "../services/StoryService";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "firebase/auth";
import { UserSettingsService } from "../services/UserSettingsService";
import { UserService } from "../services/UserService";
import { User } from "../types/User";

const StoryAddPage = () => {
    const navigate = useNavigate();
    const [projectId, setProjectId] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [ownerId, setOwnerId] = useState("");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>("medium");
    const [status, setStatus] = useState<Status>("todo");

    useEffect(() => {
        const fetchData = async () => {
            const user = getAuth().currentUser;
            if (user) {
                const id = await UserSettingsService.getActiveProjectId(user.uid);
                setProjectId(id);

                const allUsers = await UserService.getAllUsers();
                const filtered = allUsers.filter(u => u.role === "developer" || u.role === "devops");
                setUsers(filtered);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!projectId) {
            alert("Brak aktywnego projektu. Wybierz projekt przed dodaniem historyjki.");
            return;
        }

        const newStory: Story = {
            id: uuidv4(),
            name,
            description,
            priority,
            status,
            projectId,
            createdAt: new Date().toISOString(),
            ownerId: status === "doing" ? ownerId : "",
        };

        try {
            await StoryService.create(newStory);
            navigate("/stories");
        } catch (err) {
            console.error("Błąd podczas zapisu do Firestore:", err);
            alert("Nie udało się zapisać historyjki.");
        }
    };

    return (
        <div>
            <h2>Dodaj historyjkę</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Nazwa:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Opis:</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
                </div>

                <div className="form-group">
                    <label htmlFor="priority">Priorytet:</label>
                    <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                        <option value="low">Niski</option>
                        <option value="medium">Średni</option>
                        <option value="high">Wysoki</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value as Status)}>
                        <option value="todo">Do zrobienia</option>
                        <option value="doing">W trakcie</option>
                        <option value="done">Zrobione</option>
                    </select>
                </div>

                {status === "doing" && (
                    <div className="form-group">
                        <label htmlFor="owner">Przypisz do:</label>
                        <select id="owner" value={ownerId} onChange={(e) => setOwnerId(e.target.value)} required>
                            <option value="">-- wybierz --</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.firstName} {u.lastName} ({u.role})
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