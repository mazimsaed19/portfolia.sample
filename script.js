// ===================================
// Portfolio - JavaScript
// Dynamic GitHub Projects & Interactions
// ===================================

// GitHub Configuration
const GITHUB_USERNAME = 'mazimsaed19';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

// Language color mapping
const LANGUAGE_COLORS = {
  'JavaScript': '#f7df1e',
  'TypeScript': '#3178c6',
  'Python': '#3776ab',
  'PHP': '#777bb4',
  'Java': '#b07219',
  'CSS': '#563d7c',
  'HTML': '#e34c26',
  'C++': '#f34b7d',
  'C': '#555555',
  'Ruby': '#cc342d',
  'Go': '#00add8',
  'Rust': '#dea584',
  'Swift': '#ffac45',
  'Kotlin': '#a97bff',
  'default': '#8b949e'
};

// Project icons mapping
const PROJECT_ICONS = {
  'Face': '🤖',
  'face': '🤖',
  'Recognition': '👤',
  'Graph': '📊',
  'Music': '🎵',
  'music': '🎵',
  'Spotify': '🎧',
  'spotify': '🎧',
  'Dashboard': '📱',
  'dashboard': '📱',
  'Todo': '✅',
  'Site': '🌐',
  'site': '🌐',
  'Military': '🎖️',
  'Portfolio': '💼',
  'portfolio': '💼',
  'default': '📦'
};

// ===================================
// Navigation Functions
// ===================================

// Toggle mobile menu
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.classList.toggle('show');
  }
}

// Close mobile menu when clicking a link
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navLinksElement = document.getElementById('navLinks');
      if (navLinksElement && navLinksElement.classList.contains('show')) {
        navLinksElement.classList.remove('show');
      }
    });
  });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});

// ===================================
// Theme Toggle Function
// ===================================

function toggleTheme() {
  const body = document.body;
  const themeIcon = document.querySelector('.theme-icon');

  // Toggle dark mode class
  body.classList.toggle('light-mode');

  // Update icon
  if (body.classList.contains('light-mode')) {
    themeIcon.textContent = '☀️';
  } else {
    themeIcon.textContent = '🌙';
  }

  // Save preference
  const isDarkMode = !body.classList.contains('light-mode');
  localStorage.setItem('darkMode', isDarkMode);
}

// Load saved theme preference
document.addEventListener('DOMContentLoaded', () => {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'false') {
    document.body.classList.add('light-mode');
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = '☀️';
    }
  }
});

// ===================================
// GitHub Projects Fetching
// ===================================

// Get project icon based on name
function getProjectIcon(name) {
  for (const [keyword, icon] of Object.entries(PROJECT_ICONS)) {
    if (name.includes(keyword)) {
      return icon;
    }
  }
  return PROJECT_ICONS.default;
}

// Get language color
function getLanguageColor(language) {
  return LANGUAGE_COLORS[language] || LANGUAGE_COLORS.default;
}

// Create project card HTML
function createProjectCard(repo) {
  const icon = getProjectIcon(repo.name);
  const languageColor = repo.language ? getLanguageColor(repo.language) : LANGUAGE_COLORS.default;
  const description = repo.description || 'A GitHub repository with no description provided.';

  // Format the project name (replace hyphens and underscores with spaces, capitalize)
  const formattedName = repo.name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());

  return `
    <div class="project-card fade-in">
      <div class="project-header">
        <div class="project-icon">${icon}</div>
        <h3>${formattedName}</h3>
      </div>
      <p class="project-description">${description}</p>
      <div class="project-meta">
        ${repo.language ? `
          <div class="project-language">
            <span class="language-dot" style="background-color: ${languageColor}"></span>
            <span>${repo.language}</span>
          </div>
        ` : ''}
        ${repo.stargazers_count > 0 ? `
          <div class="project-language">
            <span>⭐ ${repo.stargazers_count}</span>
          </div>
        ` : ''}
      </div>
      <div class="project-links">
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
          View on GitHub
        </a>
        ${repo.homepage ? `
          <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-link">
            Live Demo
          </a>
        ` : ''}
      </div>
    </div>
  `;
}

// Fetch and display GitHub repositories
async function fetchGitHubProjects() {
  const projectsGrid = document.getElementById('projectsGrid');

  if (!projectsGrid) {
    console.error('Projects grid not found');
    return;
  }

  try {
    // Show loading spinner
    projectsGrid.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading projects from GitHub...</p>
      </div>
    `;

    // Fetch repositories from GitHub API
    const response = await fetch(GITHUB_API_URL);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    // Sort by updated date (most recent first) and filter out forks
    const sortedRepos = repos
      .filter(repo => !repo.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    // Clear loading spinner
    projectsGrid.innerHTML = '';

    // Create and add project cards
    if (sortedRepos.length > 0) {
      sortedRepos.forEach((repo, index) => {
        const cardHTML = createProjectCard(repo);
        projectsGrid.innerHTML += cardHTML;

        // Add staggered animation delay
        setTimeout(() => {
          const cards = projectsGrid.querySelectorAll('.project-card');
          if (cards[index]) {
            cards[index].style.animationDelay = `${index * 0.1}s`;
          }
        }, 10);
      });

      // Add "View All on GitHub" button
      const ctaButton = document.createElement('div');
      ctaButton.style.cssText = 'margin-top: 3rem; text-align: center;';
      ctaButton.innerHTML = `
        <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.75rem;">
          <svg viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px;">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          View All on GitHub
        </a>
      `;
      projectsGrid.parentElement.appendChild(ctaButton);

      // Update project count in stats
      const projectCount = document.getElementById('projectCount');
      if (projectCount) {
        projectCount.textContent = `${sortedRepos.length}+`;
      }
    } else {
      projectsGrid.innerHTML = `
        <div class="loading-spinner">
          <p>No projects found</p>
        </div>
      `;
    }

  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    projectsGrid.innerHTML = `
      <div class="loading-spinner">
        <p style="color: var(--color-accent-secondary);">
          Unable to load projects. Please check back later.
        </p>
      </div>
    `;
  }
}

// ===================================
// Smooth Scrolling for Anchor Links
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Skip if it's just '#' or empty
      if (!href || href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

// ===================================
// Initialize on Page Load
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  // Fetch GitHub projects
  fetchGitHubProjects();

  // Add intersection observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);

  // Observe all sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    observer.observe(section);
  });
});

// ===================================
// Parallax Effect for Hero Background
// ===================================

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const orbs = document.querySelectorAll('.gradient-orb');

  orbs.forEach((orb, index) => {
    const speed = 0.5 + (index * 0.1);
    const yPos = -(scrolled * speed);
    orb.style.transform = `translateY(${yPos}px)`;
  });
});

// ===================================
// Display current year in footer
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  const year = new Date().getFullYear();
  const footerText = document.querySelector('.footer-content p');
  if (footerText) {
    footerText.innerHTML = `&copy; ${year} Mohamed Saed Mohamed. All rights reserved.`;
  }
});

// ===================================
// Add active state to nav links
// ===================================

window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});
