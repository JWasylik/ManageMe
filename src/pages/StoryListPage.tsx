import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Story } from "../types/Story";
import { StoryService } from "../services/StoryService";
import { UserService } from "../services/UserService";
import { UserSettingsService } from "../services/UserSettingsService";
import { User } from "../types/User";
import { getAuth } from "firebase/auth";

const StoryListPage = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<{ role?: string }>({});
    const [selectedOwners, setSelectedOwners] = useState<Record<string, string>>({});
    const [projectId, setProjectId] = useState<string | null>(null);

    useEffect(() => {
        const updateUser = () => {
            const storedUser = localStorage.getItem("user");
            setUser(storedUser ? JSON.parse(storedUser) : {});
        };
        updateUser();
        window.addEventListener("userChanged", updateUser);
        return () => window.removeEventListener("userChanged", updateUser);
    }, []);

    useEffect(() => {
        const fetchProjectId = async () => {
            const currentUser = getAuth().currentUser;
            if (!currentUser) return;

            const id = await UserSettingsService.getActiveProjectId(currentUser.uid);
            setProjectId(id);
        };
        fetchProjectId();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (projectId) {
                const fetchedStories = await StoryService.getByProject(projectId);
                setStories(fetchedStories);
            }
            const fetchedUsers = await UserService.getAllUsers();
            setUsers(fetchedUsers);
        };
        fetchData();
    }, [projectId]);

    const handleDelete = async (id: string) => {
        await StoryService.delete(id);
        if (projectId) {
            const updatedStories = await StoryService.getByProject(projectId);
            setStories(updatedStories);
        }
    };

    const handleAssignUser = async (story: Story) => {
        const userId = selectedOwners[story.id];
        if (!userId) return;

        const updated: Story = {
            ...story,
            ownerId: userId,
            status: "doing",
            startDate: new Date().toISOString(),
        };

        await StoryService.update(updated);
        if (projectId) {
            const updatedStories = await StoryService.getByProject(projectId);
            setStories(updatedStories);
        }
    };

    const handleMarkDone = async (story: Story) => {
        const updated: Story = {
            ...story,
            status: "done",
            endDate: new Date().toISOString(),
        };

        await StoryService.update(updated);
        if (projectId) {
            const updatedStories = await StoryService.getByProject(projectId);
            setStories(updatedStories);
        }
    };

    if (!projectId) {
        return <p className="text-gray-700 dark:text-gray-300">Brak aktywnego projektu</p>;
    }

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-4">Historyjki dla aktywnego projektu</h2>

            {user.role !== "guest" && (
                <Link to="/stories/add" className="text-blue-500 hover:underline mb-4 inline-block">
                    ➕ Dodaj nową
                </Link>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-left">
                            <th className="p-3">Nazwa</th>
                            <th className="p-3">Opis</th>
                            <th className="p-3">Priorytet</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Przypisany</th>
                            <th className="p-3">Daty</th>
                            <th className="p-3">Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stories.map((story) => {
                            const owner = users.find((u) => u.id === story.ownerId);
                            return (
                                <tr key={story.id} className="border-b dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100">
                                    <td className="p-3 font-semibold">{story.name}</td>
                                    <td className="p-3">{story.description}</td>
                                    <td className="p-3 capitalize">{story.priority}</td>
                                    <td className="p-3 capitalize">{story.status}</td>
                                    <td className="p-3">
                                        {owner ? `${owner.firstName} ${owner.lastName} (${owner.role})` : "-"}
                                        {user.role !== "guest" && story.status === "todo" && (
                                            <div className="mt-1 flex flex-col">
                                                <select
                                                    value={selectedOwners[story.id] || ""}
                                                    onChange={(e) =>
                                                        setSelectedOwners((prev) => ({
                                                            ...prev,
                                                            [story.id]: e.target.value,
                                                        }))
                                                    }
                                                    className="text-sm bg-gray-100 dark:bg-gray-700 rounded p-1 mt-1"
                                                >
                                                    <option value="">-- wybierz --</option>
                                                    {users.map((u) => (
                                                        <option key={u.id} value={u.id}>
                                                            {u.firstName} {u.lastName} ({u.role})
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    className="text-xs text-blue-500 hover:underline mt-1"
                                                    onClick={() => handleAssignUser(story)}
                                                    disabled={!selectedOwners[story.id]}
                                                >
                                                    Przypisz i rozpocznij
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-3 whitespace-nowrap">
                                        {story.startDate && <p>📅 {new Date(story.startDate).toLocaleString()}</p>}
                                        {story.endDate && <p>✅ {new Date(story.endDate).toLocaleString()}</p>}
                                    </td>
                                    <td className="p-3 space-y-1">
                                        {user.role !== "guest" && (
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/stories/edit/${story.id}`}
                                                    className="px-3 py-1 border rounded text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                                                >
                                                    Edytuj
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(story.id)}
                                                    className="px-3 py-1 border rounded text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-gray-700 transition"
                                                >
                                                    Usuń
                                                </button>
                                            </div>
                                        )}
                                        {user.role !== "guest" && story.status === "doing" && (
                                            <button
                                                onClick={() => handleMarkDone(story)}
                                                className="text-green-500 hover:underline block mt-1"
                                            >
                                                Oznacz jako zakończoną
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoryListPage;
