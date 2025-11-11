import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { NewTask } from './pages/NewTask'
import { TaskList } from './pages/TaskList'

function App() {
  return (
    <Router basename="/verdiplan-mvp">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/new" element={<NewTask />} />
      </Routes>
    </Router>
  )
}

export default App
