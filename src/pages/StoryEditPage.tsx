import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Story, Priority, Status } from "../types/Story";
import { StoryService } from "../services/StoryService";
import { UserService } from "../services/UserService";
import { User } from "../types/User";

const StoryEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [story, setStory] = useState<Story | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [ownerId, setOwnerId] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    const s = await StoryService.getById(id);
                    if (s) {
                        setStory(s);
                        setOwnerId(s.ownerId ?? "");
                    }
                } catch (err) {
                    console.error("Błąd podczas pobierania story:", err);
                }
            }
            try {
                const fetchedUsers = await UserService.getAllUsers();
                setUsers(fetchedUsers);
            } catch (err) {
                console.error("Błąd podczas pobierania użytkowników:", err);
                setUsers([]);
            }

            setLoading(false);
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!story) return;

        if (story.status === "doing" && !ownerId) {
            alert("Dla statusu 'doing' musisz wybrać użytkownika.");
            return;
        }

        const updatedStory: Story = {
            ...story,
            ownerId: story.status === "doing" ? ownerId : "",
            startDate:
                story.status === "doing"
                    ? story.startDate ?? new Date().toISOString()
                    : undefined,
        };

        try {
            await StoryService.update(updatedStory);
            navigate("/stories");
        } catch (err) {
            console.error("Błąd przy zapisie do Firestore:", err);
            alert("Nie udało się zaktualizować historyjki.");
        }
    };

    if (loading || !story) return <p>Ładowanie...</p>;

    return (
        <div className="form-container">
            <h2 className="form-title">Edytuj historyjkę</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nazwa:</label>
                    <input
                        className="form-input"
                        value={story.name}
                        onChange={(e) =>
                            setStory({ ...story, name: e.target.value })
                        }
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Opis:</label>
                    <textarea
                        className="form-textarea"
                        value={story.description}
                        onChange={(e) =>
                            setStory({ ...story, description: e.target.value })
                        }
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Priorytet:</label>
                    <select
                        className="form-select"
                        value={story.priority}
                        onChange={(e) =>
                            setStory({ ...story, priority: e.target.value as Priority })
                        }
                    >
                        <option value="low">Niski</option>
                        <option value="medium">Średni</option>
                        <option value="high">Wysoki</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Status:</label>
                    <select
                        className="form-select"
                        value={story.status}
                        onChange={(e) =>
                            setStory({ ...story, status: e.target.value as Status })
                        }
                    >
                        <option value="todo">Do zrobienia</option>
                        <option value="doing">W trakcie</option>
                        <option value="done">Zrobione</option>
                    </select>
                </div>

                {story.status === "doing" && (
                    <div className="form-group">
                        <label>Wybierz użytkownika:</label>
                        <select
                            className="form-select"
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

                <button type="submit" className="form-button">Zapisz zmiany</button>
            </form>
        </div>
    );
};

export default StoryEditPage;
