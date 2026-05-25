import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { WelcomePage } from './pages/WelcomePage'
import { DashboardPage } from './pages/DashboardPage'
import { AgentDetailPage } from './pages/AgentDetailPage'
import { SkillEditorPage } from './pages/SkillEditorPage'
import { ProfilePage } from './pages/ProfilePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import { CommandPalette } from './components/CommandPalette'
import { GlobalAgentEditor } from './components/agents/GlobalAgentEditor'

function App() {
  return (
    <ErrorBoundary>
      <CommandPalette />
      <GlobalAgentEditor />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/:id"
          element={
            <ProtectedRoute>
              <AgentDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/:agentId/skill/:skillId"
          element={
            <ProtectedRoute>
              <SkillEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App
