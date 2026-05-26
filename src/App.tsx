import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import { CommandPalette } from './components/CommandPalette'
import { GlobalAgentEditor } from './components/agents/GlobalAgentEditor'

const WelcomePage = lazy(() => import('./pages/WelcomePage').then((m) => ({ default: m.WelcomePage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const AgentDetailPage = lazy(() => import('./pages/AgentDetailPage').then((m) => ({ default: m.AgentDetailPage })))
const SkillEditorPage = lazy(() => import('./pages/SkillEditorPage').then((m) => ({ default: m.SkillEditorPage })))
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

function RouteFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-[var(--paper)] text-[var(--ink-3)]">
      Cargando…
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <CommandPalette />
      <GlobalAgentEditor />
      <Suspense fallback={<RouteFallback />}>
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
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
