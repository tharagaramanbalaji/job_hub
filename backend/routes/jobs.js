import { Router } from 'express';
import Job from '../models/Job.js';
import protect from '../middleware/auth.js';

const router = Router();

// GET /api/jobs — public, get all jobs
router.get('/', async (_req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error fetching jobs.' });
  }
});

// GET /api/jobs/saved — protected, seeker's saved jobs
router.get('/saved', protect, async (req, res) => {
  if (req.user.userType !== 'seeker') {
    return res.status(403).json({ success: false, error: 'Only seekers can view saved jobs.' });
  }
  try {
    const jobs = await Job.find({ savedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error fetching saved jobs.' });
  }
});

// POST /api/jobs — protected, poster only
router.post('/', protect, async (req, res) => {
  if (req.user.userType !== 'poster') {
    return res.status(403).json({ success: false, error: 'Only job posters can post jobs.' });
  }

  const { title, company, salary, description, type } = req.body;
  if (!title || !company || !salary || !description || !type) {
    return res.status(400).json({ success: false, error: 'All job fields are required.' });
  }

  try {
    const job = await Job.create({
      title,
      company,
      salary,
      description,
      type,
      posterId: req.user.id,
    });
    res.status(201).json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/jobs/:id/save — protected, seeker only
router.post('/:id/save', protect, async (req, res) => {
  if (req.user.userType !== 'seeker') {
    return res.status(403).json({ success: false, error: 'Only seekers can save jobs.' });
  }

  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found.' });
    }

    // Toggle: if already saved, unsave it
    const alreadySaved = job.savedBy.includes(req.user.id);
    if (alreadySaved) {
      job.savedBy = job.savedBy.filter((id) => id.toString() !== req.user.id);
      await job.save();
      return res.json({ success: true, saved: false, message: 'Job unsaved.' });
    }

    job.savedBy.push(req.user.id);
    await job.save();
    res.json({ success: true, saved: true, message: 'Job saved successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/jobs/:id — protected, poster who owns the job
router.delete('/:id', protect, async (req, res) => {
  if (req.user.userType !== 'poster') {
    return res.status(403).json({ success: false, error: 'Only job posters can delete jobs.' });
  }

  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, error: 'Job not found.' });
    if (job.posterId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this job.' });
    }

    await job.deleteOne();
    res.json({ success: true, message: 'Job deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
