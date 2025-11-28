import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { NewTask } from "./pages/NewTask";
import { TaskList } from "./pages/TaskList";
import { TaskDetail } from "./pages/TaskDetail";
import { EditTask } from "./pages/EditTask";
import { Inventory } from "./pages/Inventory";
import { NewInventory } from "./pages/NewInventory";
import { InventoryDetail } from "./pages/InventoryDetail";
import { EditInventory } from "./pages/EditInventory";
import { Reports } from "./pages/Reports";
import { Users } from "./pages/Users";
import { Settings } from "./pages/Settings";

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/new" element={<NewTask />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="/tasks/:id/edit" element={<EditTask />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/new" element={<NewInventory />} />
        <Route path="/inventory/:id" element={<InventoryDetail />} />
        <Route path="/inventory/:id/edit" element={<EditInventory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
