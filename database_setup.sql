CREATE DATABASE job_listings_db;

USE job_listings_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('seeker', 'poster') NOT NULL
);

CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    type ENUM('remote', 'onsite', 'hybrid') NOT NULL,
    poster_id INT,
    FOREIGN KEY (poster_id) REFERENCES users(id)
);

CREATE TABLE saved_jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT,
    seeker_id INT,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (seeker_id) REFERENCES users(id)
);

-- Insert sample data
INSERT INTO users (username, password, user_type) VALUES
('seeker1', 'password123', 'seeker'),
('poster1', 'password456', 'poster');

INSERT INTO jobs (title, company, salary, description, type, poster_id) VALUES
('Software Engineer', 'Tech Co', 80000.00, 'We are looking for a talented software engineer to join our team...', 'remote', 2),
('Data Analyst', 'Data Corp', 65000.00, 'Seeking a data analyst to help interpret and visualize our data...', 'onsite', 2),
('Product Manager', 'Innovate Inc', 90000.00, 'Join our product team to lead the development of cutting-edge products...', 'hybrid', 2),
('UX Designer', 'Design Studio', 75000.00, 'Create intuitive and beautiful user experiences for our clients...', 'remote', 2),
('Full Stack Developer', 'Web Solutions', 85000.00, 'Build and maintain web applications from front to back...', 'hybrid', 2);

