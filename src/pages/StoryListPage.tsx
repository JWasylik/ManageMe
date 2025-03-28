import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Story } from "../types/Story";
import { StoryService } from "../services/StoryService";
import { ActiveProjectService } from "../services/ActiveProjectService";
import { UserService } from "../services/UserService";
import { User } from "../types/User";

const StoryListPage = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const projectId = ActiveProjectService.getActiveProjectId();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedOwners, setSelectedOwners] = useState<Record<string, string>>({});

    useEffect(() => {
        if (projectId) {
            setStories(StoryService.getByProject(projectId));
        }
        setUsers(UserService.getAllUsers());
    }, [projectId]);

    const handleDelete = (id: string) => {
        StoryService.delete(id);
        if (projectId) {
            setStories(StoryService.getByProject(projectId));
        }
    };

    const handleAssignUser = (story: Story) => {
        const userId = selectedOwners[story.id];
        if (!userId) return;

        const updatedStory: Story = {
            ...story,
            ownerId: userId,
            status: "doing",
            startDate: new Date().toISOString(),
        };

        StoryService.update(updatedStory);
        setStories(StoryService.getByProject(projectId!));
        alert("Użytkownik przypisany, status ustawiony na 'doing'");
    };

    const handleMarkDone = (story: Story) => {
        const updatedStory: Story = {
            ...story,
            status: "done",
            endDate: new Date().toISOString(),
        };

        StoryService.update(updatedStory);
        setStories(StoryService.getByProject(projectId!));
        alert("Historyjka oznaczona jako zakończona");
    };

    if (!projectId) {
        return <p>Nie wybrano aktywnego projektu. Wybierz projekt, aby zobaczyć historyjki.</p>;
    }

    const grouped = {
        todo: stories.filter((s) => s.status === "todo"),
        doing: stories.filter((s) => s.status === "doing"),
        done: stories.filter((s) => s.status === "done"),
    };

    return (
        <div>
            <h2>Historyjki dla aktywnego projektu</h2>
            <Link to="/stories/add">➕ Dodaj nową</Link>

            {["todo", "doing", "done"].map((status) => (
                <div key={status}>
                    <h3>
                        {status === "todo" && "📝 Do zrobienia"}
                        {status === "doing" && "🚧 W trakcie"}
                        {status === "done" && "✅ Zrobione"}
                    </h3>

                    {grouped[status as keyof typeof grouped].length === 0 ? (
                        <p>Brak</p>
                    ) : (
                        <ul>
                            {grouped[status as keyof typeof grouped].map((story) => {
                                const owner = story.ownerId ? UserService.getUserById(story.ownerId) : null;

                                return (
                                    <li key={story.id} style={{ marginBottom: "1rem" }}>
                                        <strong>{story.name}</strong> - {story.description} ({story.priority})
                                        {" | "}
                                        <button onClick={() => handleDelete(story.id)}>Usuń</button>
                                        {" | "}
                                        <Link to={`/stories/edit/${story.id}`}>Edytuj</Link>

                                        {/* Przypisanie użytkownika (TODO) */}
                                        {story.status === "todo" && (
                                            <div style={{ marginTop: "0.5rem" }}>
                                                <label>Przypisz użytkownika: </label>
                                                <select
                                                    value={selectedOwners[story.id] || ""}
                                                    onChange={(e) =>
                                                        setSelectedOwners((prev) => ({
                                                            ...prev,
                                                            [story.id]: e.target.value,
                                                        }))
                                                    }
                                                >
                                                    <option value="">-- wybierz --</option>
                                                    {users.map((user) => (
                                                        <option key={user.id} value={user.id}>
                                                            {user.firstName} {user.lastName} ({user.role})
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => handleAssignUser(story)}
                                                    disabled={!selectedOwners[story.id]}
                                                    style={{ marginLeft: "0.5rem" }}
                                                >
                                                    Przypisz i rozpocznij
                                                </button>
                                            </div>
                                        )}

                                        {/* Oznaczenie jako zakończoną (DOING) */}
                                        {story.status === "doing" && (
                                            <div style={{ marginTop: "0.5rem" }}>
                                                <button onClick={() => handleMarkDone(story)}>
                                                    ✅ Oznacz jako zakończoną
                                                </button>
                                            </div>
                                        )}

                                        {/* Daty */}
                                        {story.startDate && (
                                            <p>
                                                📅 Rozpoczęto: {new Date(story.startDate).toLocaleString()}
                                                {owner && <> przez: {owner.firstName} {owner.lastName}</>}
                                            </p>
                                        )}
                                        {story.endDate && (
                                            <p>✅ Zakończono: {new Date(story.endDate).toLocaleString()}</p>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
};

export default StoryListPage;
