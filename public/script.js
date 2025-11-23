document.addEventListener('DOMContentLoaded', () => {
    const jobListings = document.getElementById('jobListings');
    const savedJobs = document.getElementById('savedJobs');
    const homeLink = document.getElementById('homeLink');
    const savedJobsLink = document.getElementById('savedJobsLink');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutLink = document.getElementById('logoutLink');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const jobPostForm = document.getElementById('jobPostForm');
    const searchInput = document.getElementById('searchInput');
    const jobTypeFilters = document.querySelectorAll('.jobTypeFilter');

    let allJobs = [];
    let currentUser = null;

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(jobListings);
        fetchJobs();
    });

    savedJobsLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentUser && currentUser.user_type === 'seeker') {
            showSection(savedJobs);
            fetchSavedJobs();
        } else {
            alert('Please login as a job seeker to view saved jobs.');
        }
    });

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(loginForm);
    });

    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(registerForm);
    });

    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    document.getElementById('loginFormElement').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const userType = document.getElementById('loginUserType').value;
        login(username, password, userType);
    });

    document.getElementById('registerFormElement').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const userType = document.getElementById('registerUserType').value;
        register(username, password, userType);
    });

    document.getElementById('jobPostFormElement').addEventListener('submit', (e) => {
        e.preventDefault();
        if (currentUser && currentUser.user_type === 'poster') {
            const jobData = {
                title: document.getElementById('jobTitle').value,
                company: document.getElementById('jobCompany').value,
                salary: document.getElementById('jobSalary').value,
                description: document.getElementById('jobDescription').value,
                type: document.getElementById('jobType').value
            };
            postJob(jobData);
        } else {
            alert('You must be logged in as a job poster to post a job.');
        }
    });

    searchInput.addEventListener('input', filterJobs);
    jobTypeFilters.forEach(filter => filter.addEventListener('change', filterJobs));

    function showSection(section) {
        console.log('Showing section:', section.id);
        const sections = [jobListings, savedJobs, loginForm, registerForm];
        sections.forEach(s => s.style.display = 'none');
        section.style.display = 'block';
        
        if (currentUser && currentUser.user_type === 'poster') {
            jobPostForm.style.display = 'block';
        }
    }

    function fetchJobs() {
        fetch('/api/jobs')
            .then(response => response.json())
            .then(jobs => {
                allJobs = jobs;
                renderJobs(jobs);
            })
            .catch(error => console.error('Error:', error));
    }

    function fetchSavedJobs() {
        if (!currentUser) return;
        fetch(`/api/saved-jobs/${currentUser.id}`)
            .then(response => response.json())
            .then(jobs => {
                renderJobs(jobs, savedJobs);
            })
            .catch(error => console.error('Error:', error));
    }

    function renderJobs(jobs, container = jobListings) {
        container.innerHTML = jobs.map(job => `
            <div class="job-card">
                <h2 class="job-title">${job.title}</h2>
                <p class="job-company">${job.company}</p>
                <p class="job-salary">Salary: $${job.salary}</p>
                <p class="job-type">Type: ${job.type}</p>
                <p class="job-description">${job.description}</p>
                ${currentUser && currentUser.user_type === 'seeker' ? `<button onclick="saveJob(${job.id})" class="btn btn-primary">Save Job</button>` : ''}
            </div>
        `).join('');
    }

    function filterJobs() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedTypes = Array.from(jobTypeFilters)
            .filter(filter => filter.checked)
            .map(filter => filter.value);

        const filteredJobs = allJobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm) ||
                                  job.company.toLowerCase().includes(searchTerm) ||
                                  job.description.toLowerCase().includes(searchTerm);
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);
            return matchesSearch && matchesType;
        });

        renderJobs(filteredJobs);
    }

    function login(username, password, userType) {
        console.log('Attempting login with:', { username, userType });
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, userType }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Login response:', data);
            if (data.success) {
                currentUser = data.user;
                updateUIForLoggedInUser();
                showSection(jobListings);
                fetchJobs();
            } else {
                alert('Login failed. Please check your credentials.');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function register(username, password, userType) {
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, userType }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Registration successful. Please log in.');
                showSection(loginForm);
            } else {
                alert('Registration failed. Please try again.');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function logout() {
        currentUser = null;
        updateUIForLoggedOutUser();
        showSection(jobListings);
        fetchJobs();
    }

    function updateUIForLoggedInUser() {
        console.log('Updating UI for user:', currentUser);
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        logoutLink.style.display = 'inline';
        
        showSection(jobListings);
        
        if (currentUser.user_type === 'poster') {
            console.log('User is a job poster, showing post form');
            jobPostForm.style.display = 'block';
            savedJobsLink.style.display = 'none';
        } else {
            jobPostForm.style.display = 'none';
            savedJobsLink.style.display = 'inline';
        }
    }

    function updateUIForLoggedOutUser() {
        loginLink.style.display = 'inline';
        registerLink.style.display = 'inline';
        logoutLink.style.display = 'none';
        jobPostForm.style.display = 'none';
        savedJobsLink.style.display = 'none';
    }

    function postJob(jobData) {
        fetch('/api/jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...jobData, poster_id: currentUser.id }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Job posted successfully!');
                fetchJobs();
            } else {
                alert('Failed to post job. Please try again.');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    window.saveJob = function(jobId) {
        if (!currentUser) {
            alert('Please log in to save jobs.');
            return;
        }
        fetch('/api/save-job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jobId, seekerId: currentUser.id }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Job saved successfully!');
            } else {
                alert('Failed to save job.');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Fetch jobs when the page loads
    fetchJobs();
});

