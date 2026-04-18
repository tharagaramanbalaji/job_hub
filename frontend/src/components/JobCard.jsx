import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TYPE_COLORS = {
  remote: 'badge-remote',
  onsite: 'badge-onsite',
  hybrid: 'badge-hybrid',
};

const TYPE_ICONS = {
  remote: '🌐',
  onsite: '🏢',
  hybrid: '🔀',
};

const JobCard = ({ job, onSaveToggle }) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const isSaved = user && job.savedBy?.includes(user.id);

  const handleSave = async () => {
    if (!user) {
      toast.error('Please login as a job seeker to save jobs.');
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.post(`/jobs/${job._id}/save`);
      toast.success(data.message);
      onSaveToggle?.(job._id, data.saved);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save job.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <h2 className="job-title">{job.title}</h2>
          <p className="job-company">🏷️ {job.company}</p>
        </div>
        <span className={`badge ${TYPE_COLORS[job.type]}`}>
          {TYPE_ICONS[job.type]} {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
        </span>
      </div>

      <p className="job-description">{job.description}</p>

      <div className="job-card-footer">
        <span className="job-salary">
          💰 ${Number(job.salary).toLocaleString()} / yr
        </span>
        {user?.userType === 'seeker' && (
          <button
            onClick={handleSave}
            disabled={saving}
            className={`btn ${isSaved ? 'btn-saved' : 'btn-primary'}`}
          >
            {saving ? '...' : isSaved ? '✓ Saved' : 'Save Job'}
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
