import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ProjectListPage from "./pages/ProjectListPage";
import AddProjectPage from "./pages/AddProjectPage";
import EditProjectPage from "./pages/EditProjectPage";
import StoryAddPage from "./pages/StoryAddPage";
import StoryEditPage from "./pages/StoryEditPage";
import TaskAddPage from "./pages/TaskAddPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import TaskBoardPage from "./pages/TaskBoardPage";
import StoryListPage from "./pages/StoryListPage";
import { UserSettingsService } from "./services/UserSettingsService";
import { ProjectService } from "./services/ProjectService";
import { Project } from "./types/Project";
import { User } from "./types/User";
import LoginPage from "./pages/LoginPage";
import Logout from "./pages/LogoutPage";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./components/PrivateRoute";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { UserService } from "./services/UserService";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const fullUser = await UserService.getById(firebaseUser.uid);
        if (fullUser) {
          setUser(fullUser);
          const projectId = await UserSettingsService.getActiveProjectId(fullUser.id);
          if (projectId) {
            const project = await ProjectService.getById(projectId);
            if (project) setActiveProject(project);
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    const handleActiveProjectChange = async () => {
      const firebaseUser = getAuth().currentUser;
      if (firebaseUser) {
        const fullUser = await UserService.getById(firebaseUser.uid);
        if (fullUser) {
          setUser(fullUser);
          const projectId = await UserSettingsService.getActiveProjectId(fullUser.id);
          if (projectId) {
            const project = await ProjectService.getById(projectId);
            if (project) setActiveProject(project);
          }
        }
      }
    };

    window.addEventListener("activeProjectChanged", handleActiveProjectChange);
    return () => {
      unsubscribe();
      window.removeEventListener("activeProjectChanged", handleActiveProjectChange);
    };
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto p-4 text-gray-900 dark:text-white dark:bg-gray-900 min-h-screen">
      <NavBar onToggleTheme={() => setDarkMode((prev) => !prev)} />

      {user && activeProject && (
        <div className="bg-gray-100 dark:bg-gray-800 p-2 text-sm text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 mt-2 rounded">
          🟢 <strong>Aktywny projekt:</strong> {activeProject.name}
        </div>
      )}

      <Routes>
        <Route path="/projects" element={<PrivateRoute><ProjectListPage /></PrivateRoute>} />
        <Route path="/projects/add" element={<PrivateRoute requireNotGuest={true}><AddProjectPage /></PrivateRoute>} />
        <Route path="/projects/edit/:id" element={<PrivateRoute><EditProjectPage /></PrivateRoute>} />
        <Route path="*" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/stories" element={<PrivateRoute><StoryListPage /></PrivateRoute>} />
        <Route path="/stories/add" element={<PrivateRoute requireNotGuest={true}><StoryAddPage /></PrivateRoute>} />
        <Route path="/stories/edit/:id" element={<PrivateRoute><StoryEditPage /></PrivateRoute>} />
        <Route path="/tasks/board" element={<PrivateRoute><TaskBoardPage /></PrivateRoute>} />
        <Route path="/tasks/add" element={<PrivateRoute requireNotGuest={true}><TaskAddPage /></PrivateRoute>} />
        <Route path="/tasks/:id" element={<PrivateRoute><TaskDetailPage /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;
