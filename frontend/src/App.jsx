import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SavedJobs from './pages/SavedJobs';
import PostJob from './pages/PostJob';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e1e2e',
              color: '#cdd6f4',
              border: '1px solid #313244',
              borderRadius: '12px',
            },
          }}
        />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/saved" element={<SavedJobs />} />
          <Route path="/post-job" element={<PostJob />} />
        </Routes>
        <footer className="footer">
          <p>© 2025 JobHub · Built with React + MongoDB</p>
        </footer>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
