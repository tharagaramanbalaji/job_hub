import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';

const SavedJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.userType !== 'seeker') {
      navigate('/login');
      return;
    }
    api
      .get('/jobs/saved')
      .then(({ data }) => setJobs(data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleSaveToggle = (jobId, saved) => {
    if (!saved) {
      // Remove from list when unsaved
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    }
  };

  return (
    <main className="page">
      <div className="content-container">
        <div className="page-header">
          <h1 className="page-title">🔖 Saved Jobs</h1>
          <p className="page-sub">{jobs.length} job{jobs.length !== 1 ? 's' : ''} saved</p>
        </div>

        {loading && (
          <div className="status-wrap">
            <div className="spinner" />
            <p>Loading saved jobs...</p>
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div className="status-wrap">
            <p className="empty-text">You haven't saved any jobs yet.</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Browse Jobs
            </button>
          </div>
        )}

        <div className="job-grid">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} onSaveToggle={handleSaveToggle} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default SavedJobs;
