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
import { ActiveProjectService } from "./services/ActiveProjectService";
import { ProjectService } from "./services/ProjectService";
import { Project } from "./types/Project";
import LoginPage from "./pages/LoginPage";
import Logout from "./pages/LogoutPage";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";


function App() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    const id = ActiveProjectService.getActiveProjectId();
    if (id) {
      const project = ProjectService.getById(id);
      if (project) setActiveProject(project);
    }
  }, []);

  const handleSetActiveProject = (id: string) => {
    ActiveProjectService.setActiveProjectId(id);
    const project = ProjectService.getById(id);
    if (project) setActiveProject(project);
  };

  return (
    <div style={{ padding: "1rem 2rem 0", maxWidth: "1000px", margin: "auto" }}>
      <NavBar />

      <Routes>
        <Route path="/projects" element={<ProjectListPage onSetActiveProject={handleSetActiveProject} />} />
        <Route path="/projects/add" element={<AddProjectPage />} />
        <Route path="/projects/edit/:id" element={<EditProjectPage />} />
        <Route path="*" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/stories" element={<StoryListPage />} />
        <Route path="/stories/add" element={<StoryAddPage />} />
        <Route path="/stories/edit/:id" element={<StoryEditPage />} />
        <Route path="/tasks/add" element={<TaskAddPage />} />
        <Route path="/tasks/:id" element={<TaskDetailPage />} />
        <Route path="/tasks/board" element={<TaskBoardPage />} />

      </Routes>

      {activeProject && (
        <p style={{ marginTop: "1rem" }}>
          🟢 <strong>Aktywny projekt:</strong> {activeProject.name}
        </p>
      )}
    </div>
  );
}

export default App;
