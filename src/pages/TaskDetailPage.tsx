import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Task } from "../types/Task";
import { TaskService } from "../services/TaskService";
import { StoryService } from "../services/StoryService";
import { UserService } from "../services/UserService";
import { User } from "../types/User";

const user = JSON.parse(localStorage.getItem("user") || "{}") as { role?: string };

const TaskDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [assignableUsers, setAssignableUsers] = useState<User[]>([]);
    const [assignedUserId, setAssignedUserId] = useState<string>("");
    const [storyName, setStoryName] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            const fetchedTask = await TaskService.getById(id);
            if (fetchedTask) {
                setTask(fetchedTask);
                setAssignedUserId(fetchedTask.assignedUserId ?? "");

                const story = await StoryService.getById(fetchedTask.storyId);
                if (story) setStoryName(story.name);
            }

            const users = await UserService.getAllUsers();
            const filtered = users.filter((u) => u.role === "developer" || u.role === "devops");
            setAssignableUsers(filtered);
        };

        fetchData();
    }, [id]);

    const handleAssign = async () => {
        if (!task || !assignedUserId) return;

        const updated: Task = {
            ...task,
            assignedUserId,
            status: "doing",
            startDate: task.startDate ?? new Date().toISOString(),
        };

        await TaskService.update(updated);
        setTask(updated);
        alert("Zadanie przypisane i oznaczone jako 'doing'");
    };

    const handleComplete = async () => {
        if (!task || !task.assignedUserId) return;

        const updated: Task = {
            ...task,
            status: "done",
            endDate: task.endDate ?? new Date().toISOString(),
        };

        await TaskService.update(updated);
        setTask(updated);
        alert("Zadanie oznaczone jako 'done'");
    };

    if (!task) return <p>Ładowanie zadania...</p>;

    const assignedUser = assignableUsers.find(u => u.id === task.assignedUserId);

    return (
        <div>
            <h2>Szczegóły zadania</h2>
            <p><strong>Nazwa:</strong> {task.name}</p>
            <p><strong>Opis:</strong> {task.description}</p>
            <p><strong>Priorytet:</strong> {task.priority}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Historyjka:</strong> {storyName}</p>
            <p><strong>Data utworzenia:</strong> {new Date(task.createdAt).toLocaleString()}</p>
            {task.startDate && <p><strong>Data rozpoczęcia:</strong> {new Date(task.startDate).toLocaleString()}</p>}
            {task.endDate && <p><strong>Data zakończenia:</strong> {new Date(task.endDate).toLocaleString()}</p>}
            <p><strong>Szacowany czas:</strong> {task.estimatedHours} godz.</p>
            <p><strong>Osoba przypisana:</strong> {assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName}` : "Brak"}</p>

            <hr />

            {user.role !== "guest" && task.status === "todo" && (
                <div>
                    <label>Przypisz do:</label>
                    <select
                        value={assignedUserId}
                        onChange={(e) => setAssignedUserId(e.target.value)}
                    >
                        <option value="">-- wybierz --</option>
                        {assignableUsers.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.firstName} {u.lastName} ({u.role})
                            </option>
                        ))}
                    </select>
                    <button onClick={handleAssign} disabled={!assignedUserId}>
                        Przypisz i rozpocznij
                    </button>
                </div>
            )}

            {user.role !== "guest" && task.status === "doing" && (
                <div>
                    <button onClick={handleComplete}>Oznacz jako wykonane</button>
                </div>
            )}

            <hr />
            <button onClick={() => navigate("/tasks/board")}>↩️ Wróć do tablicy</button>
        </div>
    );
};

export default TaskDetailPage;
