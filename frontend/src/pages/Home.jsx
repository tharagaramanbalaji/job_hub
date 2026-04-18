import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import SearchFilters from '../components/SearchFilters';

const Home = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/jobs');
      setAllJobs(data);
    } catch {
      setError('Failed to load jobs. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSaveToggle = (jobId, saved) => {
    setAllJobs((prev) =>
      prev.map((j) => {
        if (j._id !== jobId) return j;
        return {
          ...j,
          savedBy: saved
            ? [...(j.savedBy || []), 'me']
            : (j.savedBy || []).filter((id) => id !== 'me'),
        };
      })
    );
  };

  const filtered = allJobs.filter((job) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q);
    const matchType = selectedTypes.length === 0 || selectedTypes.includes(job.type);
    return matchSearch && matchType;
  });

  return (
    <main className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">🚀 Your next opportunity awaits</div>
        <h1 className="hero-title">
          Find Your <span className="gradient-text">Dream Job</span>
        </h1>
        <p className="hero-sub">
          Browse {allJobs.length}+ listings across remote, onsite, and hybrid roles.
        </p>
      </section>

      <div className="content-container">
        <SearchFilters
          search={search}
          setSearch={setSearch}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
        />

        {loading && (
          <div className="status-wrap">
            <div className="spinner" />
            <p>Loading jobs...</p>
          </div>
        )}

        {error && (
          <div className="status-wrap error-box">
            <p>⚠️ {error}</p>
            <button className="btn btn-ghost" onClick={fetchJobs}>Retry</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="status-wrap">
            <p className="empty-text">No jobs match your search. Try different filters!</p>
          </div>
        )}

        <div className="job-grid">
          {filtered.map((job) => (
            <JobCard key={job._id} job={job} onSaveToggle={handleSaveToggle} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
