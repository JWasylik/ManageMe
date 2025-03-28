import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Task } from "../types/Task";
import { TaskService } from "../services/TaskService";
import { StoryService } from "../services/StoryService";
import { ActiveProjectService } from "../services/ActiveProjectService";

const TaskBoardPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const projectId = ActiveProjectService.getActiveProjectId();

    useEffect(() => {
        if (!projectId) return;
        const allTasks = TaskService.getAll();
        const relatedStories = StoryService.getByProject(projectId).map(s => s.id);
        const projectTasks = allTasks.filter(t => relatedStories.includes(t.storyId));
        setTasks(projectTasks);
    }, [projectId]);

    const grouped = {
        todo: tasks.filter(t => t.status === "todo"),
        doing: tasks.filter(t => t.status === "doing"),
        done: tasks.filter(t => t.status === "done"),
    };

    if (!projectId) {
        return <p>Brak aktywnego projektu – ustaw projekt, aby zobaczyć tablicę zadań.</p>;
    }

    return (
        <div>
            <h2>Tablica zadań (Kanban)</h2>
            <Link to="/tasks/add">➕ Dodaj zadanie</Link>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                {["todo", "doing", "done"].map((status) => (
                    <div key={status} style={{ flex: 1, border: "1px solid #ccc", padding: "0.5rem" }}>
                        <h3>
                            {status === "todo" && "📝 Do zrobienia"}
                            {status === "doing" && "🚧 W trakcie"}
                            {status === "done" && "✅ Zrobione"}
                        </h3>

                        {grouped[status as keyof typeof grouped].length === 0 ? (
                            <p>Brak zadań</p>
                        ) : (
                            <ul>
                                {grouped[status as keyof typeof grouped].map((task) => (
                                    <li key={task.id}>
                                        <Link to={`/tasks/${task.id}`}>
                                            {task.name} ({task.priority})
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskBoardPage;
