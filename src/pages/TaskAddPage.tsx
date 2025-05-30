import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Task } from "../types/Task";
import { Story } from "../types/Story";
import { StoryService } from "../services/StoryService";
import { TaskService } from "../services/TaskService";
import { getAuth } from "firebase/auth";
import { UserSettingsService } from "../services/UserSettingsService";

const AddTaskPage = () => {
    const navigate = useNavigate();
    const [projectId, setProjectId] = useState<string | null>(null);

    const [stories, setStories] = useState<Story[]>([]);
    const [storyId, setStoryId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
    const [estimatedHours, setEstimatedHours] = useState(1);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchActiveProjectId = async () => {
            const currentUser = getAuth().currentUser;
            if (!currentUser) {
                setProjectId(null);
                return;
            }

            const id = await UserSettingsService.getActiveProjectId(currentUser.uid);
            setProjectId(id);
        };

        fetchActiveProjectId();
    }, []);


    useEffect(() => {
        const fetchStories = async () => {
            if (!projectId) {
                setStories([]);
                setLoading(false);
                return;
            }

            try {
                const allStories = await StoryService.getByProject(projectId);
                setStories(allStories);
            } catch (error) {
                console.error("Błąd podczas pobierania historyjek:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [projectId]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!projectId || !storyId) {
            alert("Musisz wybrać historyjkę i mieć aktywny projekt.");
            return;
        }

        const newTask: Task = {
            id: crypto.randomUUID(),
            name,
            description,
            priority,
            storyId,
            estimatedHours,
            status: "todo",
            createdAt: new Date().toISOString(),
        };

        try {
            await TaskService.create(newTask);
            navigate("/tasks/board");
        } catch (error) {
            console.error("Błąd podczas tworzenia zadania:", error);
            alert("Nie udało się dodać zadania.");
        }
    };


    if (!projectId) {
        return <p>Brak aktywnego projektu — wybierz projekt przed dodaniem zadania.</p>;
    }

    return (
        <div>
            <h2>Dodaj zadanie</h2>

            {loading ? (
                <p>Ładowanie danych...</p>
            ) : stories.length === 0 ? (
                <p>Brak dostępnych historyjek. W pierwszej kolejności dodaj historyjkę.</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="taskName">Nazwa:</label>
                        <input
                            id="taskName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description">Opis:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="estimatedHours">Przewidywane godziny:</label>
                        <input
                            type="number"
                            min={1}
                            id="estimatedHours"
                            value={estimatedHours}
                            onChange={(e) => setEstimatedHours(Number(e.target.value))}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="priority">Priorytet:</label>
                        <select
                            id="priority"
                            value={priority}
                            onChange={(e) =>
                                setPriority(e.target.value as "low" | "medium" | "high")
                            }
                        >
                            <option value="low">Niski</option>
                            <option value="medium">Średni</option>
                            <option value="high">Wysoki</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="storyId">Historyjka:</label>
                        <select
                            id="storyId"
                            value={storyId}
                            onChange={(e) => setStoryId(e.target.value)}
                            required
                        >
                            <option value="">-- Wybierz historyjkę --</option>
                            {stories.map((story) => (
                                <option key={story.id} value={story.id}>
                                    {story.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit">Zapisz</button>
                </form>
            )}
        </div>
    );
};

export default AddTaskPage;
