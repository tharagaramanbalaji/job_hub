import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    company: '',
    salary: '',
    description: '',
    type: 'remote',
  });
  const [loading, setLoading] = useState(false);

  if (!user || user.userType !== 'poster') {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/jobs', { ...form, salary: Number(form.salary) });
      toast.success('Job posted successfully! 🎉');
      setForm({ title: '', company: '', salary: '', description: '', type: 'remote' });
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page auth-page">
      <div className="auth-card post-job-card">
        <div className="auth-header">
          <span className="auth-icon">📢</span>
          <h1 className="auth-title">Post a Job</h1>
          <p className="auth-sub">Find your next great hire on JobHub</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" id="postJobForm">
          <div className="form-group">
            <label htmlFor="jobTitle">Job Title</label>
            <input
              id="jobTitle"
              name="title"
              type="text"
              placeholder="e.g. Senior React Developer"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="jobCompany">Company</label>
            <input
              id="jobCompany"
              name="company"
              type="text"
              placeholder="e.g. Acme Corp"
              value={form.company}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="jobSalary">Annual Salary ($)</label>
              <input
                id="jobSalary"
                name="salary"
                type="number"
                placeholder="e.g. 80000"
                value={form.salary}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="jobType">Job Type</label>
              <select id="jobType" name="type" value={form.type} onChange={handleChange}>
                <option value="remote">🌐 Remote</option>
                <option value="onsite">🏢 Onsite</option>
                <option value="hybrid">🔀 Hybrid</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="jobDescription">Description</label>
            <textarea
              id="jobDescription"
              name="description"
              placeholder="Describe the role, responsibilities, and requirements..."
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            id="postJobSubmit"
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default PostJob;
