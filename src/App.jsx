import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/AuthProvider';
import { MarkdownProvider } from '../src/contexts/MDProvider';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/auth/Signup';
import Note from './components/Note/Note';
import DisplayNote from './components/Note/DisplayNote';

function App() {
  return (
    <AuthProvider>
      <MarkdownProvider>
        <BrowserRouter>
          <Routes>
            <Route
              exact
              path='/'
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path='/folder/:folderId'
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path='/editor'
              element={
                <PrivateRoute>
                  <Note />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path='/preview'
              element={
                <PrivateRoute>
                  <DisplayNote />
                </PrivateRoute>
              }
            />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </MarkdownProvider>
    </AuthProvider>
  );
}

export default App;
