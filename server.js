import express from 'express';
import mysql from 'mysql2';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// MySQL connection
const connection = mysql.createConnection({
    host: 'host_name', /* change host */
    user: 'user_name', /* change root */
    password: 'db_password', /* change password */
    database: 'database_name'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

app.use(express.static('public'));
app.use(express.json());

// API routes
app.get('/api/jobs', (req, res) => {
    const query = 'SELECT * FROM jobs';
    connection.query(query, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error fetching jobs' });
        } else {
            res.json(results);
        }
    });
});

app.get('/api/saved-jobs/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = 'SELECT j.* FROM jobs j INNER JOIN saved_jobs s ON j.id = s.job_id WHERE s.seeker_id = ?';
    connection.query(query, [userId], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error fetching saved jobs' });
        } else {
            res.json(results);
        }
    });
});

app.post('/api/save-job', (req, res) => {
    const { jobId, seekerId } = req.body;
    const query = 'INSERT INTO saved_jobs (job_id, seeker_id) VALUES (?, ?)';
    connection.query(query, [jobId, seekerId], (error) => {
        if (error) {
            res.status(500).json({ success: false, error: 'Error saving job' });
        } else {
            res.json({ success: true });
        }
    });
});

app.post('/api/jobs', (req, res) => {
    const { title, company, salary, description, type, poster_id } = req.body;
    const query = 'INSERT INTO jobs (title, company, salary, description, type, poster_id) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [title, company, salary, description, type, poster_id], (error, results) => {
        if (error) {
            res.status(500).json({ success: false, error: 'Error posting job' });
        } else {
            res.json({ success: true, jobId: results.insertId });
        }
    });
});

app.post('/api/register', async (req, res) => {
    const { username, password, userType } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)';
        connection.query(query, [username, hashedPassword, userType], (error) => {
            if (error) {
                res.status(500).json({ success: false, error: 'Error registering user' });
            } else {
                res.json({ success: true });
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error hashing password' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password, userType } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND user_type = ?';
    connection.query(query, [username, userType], async (error, results) => {
        if (error) {
            res.status(500).json({ success: false, error: 'Error logging in' });
        } else if (results.length === 0) {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
        } else {
            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                res.json({ success: true, user: { id: user.id, username: user.username, user_type: user.user_type } });
            } else {
                res.status(401).json({ success: false, error: 'Invalid credentials' });
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

