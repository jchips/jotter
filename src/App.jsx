import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/AuthProvider';
import { MarkdownProvider } from '../src/contexts/MDProvider';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Signup from './components/auth/Signup';
import Editor from './components/Note/Editor';
import View from './components/Note/View';
import Settings from './components/Settings/Settings';
import './assets/sass/App.scss';

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
              path='/editor/:noteId'
              element={
                <PrivateRoute>
                  <Editor />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path='/preview/:noteId'
              element={
                <PrivateRoute>
                  <View />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path='/settings'
              element={
                <PrivateRoute>
                  <Settings />
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
