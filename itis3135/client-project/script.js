/*
  Main JavaScript for the portfolio site.
  This file handles:
  1. Dynamic project rendering, search, and tag filtering
  2. Expandable accordion cards on experience, skills, and resume pages
  3. Contact form validation and live feedback
  4. Animated canvas background
  5. Dynamic social icon rendering
*/

const projects = [
  {
    title: "Smart Pet Feeder",
    description:
      "An automated smart pet feeder powered by a Raspberry Pi and controlled through a full-stack web application. The feeder supports both scheduled and manual feeding with ±5g precision, real-time camera streaming, and motor-controlled dispensing. Built with Next.js, Express, and MongoDB.",
    imageSrc: "assets/smartpetfeeder.png",
    imageAlt: "Smart Pet Feeder logo",
    repoLink: "https://github.com/stardustgd/SmartPetFeeder",
    webLink: "https://smart-pet-feeder.vercel.app/",
    tags: ["Next.js", "TypeScript", "Raspberry Pi"],
  },
  {
    title: "Soñando Sin Miedo",
    description:
      "A responsive web application built for a nonprofit organization supporting scholars from underprivileged backgrounds. The website supports an average of 100 users per month and features full Spanish language support with locale-based routing.",
    imageSrc: "assets/sonando_sin_miedo.png",
    imageAlt: "Soñando Sin Miedo image",
    repoLink: null,
    webLink: "https://sonandosinmiedo.org",
    tags: ["Next.js", "TypeScript", "Figma", "Framer Motion"],
  },
  {
    title: "Interactive Campus Map",
    description:
      "A mobile application designed to help Antelope Valley College students navigate campus and discover available resources. Built with Android SDK and Flutter. This app was presented to the college board, resulting in $10,000 in funding to support future student developers.",
    imageSrc: "assets/avc_interactive_map.png",
    imageAlt: "AVC Interactive Campus Map",
    repoLink: "https://github.com/AVC-CS-Committee/InteractiveCampusMap",
    webLink: null,
    tags: ["Android Studio", "Java", "Flutter", "Figma"],
  },
  {
    title: "x86 Bank",
    description:
      "A console-based banking application built in x86 Assembly featuring multi-account support and a file-based database. Users can create accounts, perform deposits and withdrawals, and calculate accumulated interest through a command-line interface.",
    imageSrc: "assets/x86Bank.png",
    imageAlt: "x86 Bank image",
    repoLink: "https://github.com/stardustgd/x86-Bank",
    webLink: null,
    tags: ["x86 Assembly", "Irvine32", "MASM", "PowerShell", "Bash"],
  },
];

const socials = [
  {
    link: "mailto:sdalator@outlook.com",
    label: "Email",
    modifier: "social-link--email",
    icon: `
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M1.5 4.5h21v15h-21zm1.7 1.5 8.8 6.64L20.8 6H3.2zm17.8 12V7.77l-8.55 6.45a.75.75 0 0 1-.9 0L3 7.77V18z"></path>
      </svg>
    `,
  },
  {
    link: "https://www.linkedin.com/in/sebastian-at/",
    label: "LinkedIn",
    modifier: "social-link--linkedin",
    icon: `
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46 2.48 2.48 0 0 0 4.98 3.5zM3 9h4v12H3zm7 0h3.83v1.64h.05c.53-1 1.84-2.05 3.79-2.05C21.2 8.59 22 10.89 22 14.03V21h-4v-6.18c0-1.47-.03-3.36-2.05-3.36-2.06 0-2.37 1.6-2.37 3.25V21h-4z"></path>
      </svg>
    `,
  },
  {
    link: "https://www.github.com/stardustgd",
    label: "GitHub",
    modifier: "social-link--github",
    icon: `
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.1.82-.26.82-.58v-2.02c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.22 1.83 1.22 1.06 1.81 2.79 1.28 3.47.97.11-.77.42-1.28.76-1.57-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.53.12-3.19 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.89.12 3.19.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5z"></path>
      </svg>
    `,
  },
];

const projectState = {
  activeTag: "All",
  searchTerm: "",
};

function createProjectLinks(project, mobile = false) {
  const links = [];

  if (project.repoLink) {
    links.push(`
      <a class="project-link" href="${project.repoLink}" target="_blank" rel="noreferrer" aria-label="${project.title} GitHub repository" title="GitHub repository">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.1.82-.26.82-.58v-2.02c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.22 1.83 1.22 1.06 1.81 2.79 1.28 3.47.97.11-.77.42-1.28.76-1.57-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.53.12-3.19 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.89.12 3.19.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5z"></path>
        </svg>
      </a>
    `);
  }

  if (project.webLink) {
    links.push(`
      <a class="project-link" href="${project.webLink}" target="_blank" rel="noreferrer" aria-label="${project.title} live site" title="Live site">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14z"></path>
          <path d="M5 5h6v2H7v10h10v-4h2v6H5z"></path>
        </svg>
      </a>
    `);
  }

  return `<div class="${mobile ? "project-card__mobile-links" : "project-card__links"}">${links.join("")}</div>`;
}

function getFilteredProjects() {
  return projects.filter((project) => {
    const matchesTag =
      projectState.activeTag === "All" ||
      project.tags.includes(projectState.activeTag);

    const searchableText = [
      project.title,
      project.description,
      ...project.tags,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(projectState.searchTerm.toLowerCase());

    return matchesTag && matchesSearch;
  });
}

function renderProjects() {
  const container = document.getElementById("projects-list");
  const count = document.getElementById("project-results-count");

  if (!container) return;

  const filteredProjects = getFilteredProjects();

  if (count) {
    count.textContent =
      filteredProjects.length === projects.length &&
      projectState.activeTag === "All" &&
      projectState.searchTerm === ""
        ? "Showing all projects"
        : `Showing ${filteredProjects.length} project${filteredProjects.length === 1 ? "" : "s"}`;
  }

  if (filteredProjects.length === 0) {
    container.innerHTML = `
      <div class="project-empty-state">
        <p>No projects matched your search or selected tag.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredProjects
    .map(
      (project) => `
        <article class="project-card">
          <div class="project-card__header">
            <h3 class="project-card__title">${project.title}</h3>
            ${createProjectLinks(project)}
          </div>
          <div class="project-card__body">
            <div class="project-card__image-wrap">
              <img class="project-card__image" src="${project.imageSrc}" alt="${project.imageAlt}" />
            </div>
            ${createProjectLinks(project, true)}
            <div class="project-card__content">
              <p class="project-card__description">${project.description}</p>
              <div class="project-card__tags">
                ${project.tags
                  .map((tag) => `<span class="project-tag">${tag}</span>`)
                  .join("")}
              </div>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderTagFilters() {
  const filterContainer = document.getElementById("tag-filters");
  if (!filterContainer) return;

  const uniqueTags = ["All", ...new Set(projects.flatMap((project) => project.tags))];

  filterContainer.innerHTML = uniqueTags
    .map(
      (tag) => `
        <button
          class="tag-filter-button ${tag === projectState.activeTag ? "tag-filter-button--active" : ""}"
          type="button"
          data-tag="${tag}"
        >
          ${tag}
        </button>
      `
    )
    .join("");
}

function setupProjectFilters() {
  const searchInput = document.getElementById("project-search");
  const filterContainer = document.getElementById("tag-filters");

  if (!searchInput || !filterContainer) {
    renderProjects();
    return;
  }

  renderTagFilters();
  renderProjects();

  searchInput.addEventListener("input", (event) => {
    projectState.searchTerm = event.target.value.trim();
    renderProjects();
  });

  filterContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tag]");
    if (!button) return;

    projectState.activeTag = button.dataset.tag;
    renderTagFilters();
    renderProjects();
  });
}

function setupAccordions() {
  const accordionButtons = document.querySelectorAll(".accordion-toggle");

  accordionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".accordion-card");
      const panel = card.querySelector(".accordion-panel");
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!isExpanded));
      button.textContent = isExpanded ? "View details" : "Hide details";
      panel.hidden = isExpanded;
      card.classList.toggle("is-open", !isExpanded);
    });
  });
}

function renderSocials() {
  const container = document.getElementById("social-links");
  if (!container) return;

  container.innerHTML = socials
    .map(
      (social) => `
        <a class="social-link ${social.modifier}" href="${social.link}" target="_blank" rel="noreferrer" aria-label="${social.label}" title="${social.label}">
          ${social.icon}
        </a>
      `
    )
    .join("");
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const subjectInput = document.getElementById("contact-subject");
  const messageInput = document.getElementById("contact-message");
  const status = document.getElementById("form-status");
  const messageCount = document.getElementById("message-count");

  const errors = {
    name: document.getElementById("name-error"),
    email: document.getElementById("email-error"),
    subject: document.getElementById("subject-error"),
    message: document.getElementById("message-error"),
  };

  function setError(field, message) {
    errors[field].textContent = message;
  }

  function clearStatus() {
    status.textContent = "";
    status.className = "form-status";
  }

  function updateCount() {
    messageCount.textContent = `${messageInput.value.length} / 300`;
  }

  function validateForm() {
    let isValid = true;

    if (nameInput.value.trim() === "") {
      setError("name", "Please enter your name.");
      isValid = false;
    } else {
      setError("name", "");
    }

    if (emailInput.value.trim() === "") {
      setError("email", "Please enter your email.");
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      setError("email", "Please enter a valid email address.");
      isValid = false;
    } else {
      setError("email", "");
    }

    if (subjectInput.value.trim() === "") {
      setError("subject", "Please enter a subject.");
      isValid = false;
    } else {
      setError("subject", "");
    }

    if (messageInput.value.trim() === "") {
      setError("message", "Please enter a message.");
      isValid = false;
    } else if (messageInput.value.trim().length < 15) {
      setError("message", "Message should be at least 15 characters.");
      isValid = false;
    } else {
      setError("message", "");
    }

    return isValid;
  }

  [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
    input.addEventListener("input", () => {
      clearStatus();
      validateForm();
      updateCount();
    });
  });

  updateCount();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearStatus();

    if (!validateForm()) {
      status.textContent = "Please fix the errors above before submitting.";
      status.classList.add("form-status--error");
      return;
    }

    status.textContent = "Message sent successfully. Thank you for reaching out.";
    status.classList.add("form-status--success");
    form.reset();
    updateCount();
  });
}

function setupGridBackground() {
  const canvas = document.getElementById("grid-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const squareSize = 96;
  const colors = ["#5E81AC4D", "#8FBCBB33", "#88C0D040", "#81A1C13B"];
  const bgColor = "#2E3440";
  const gridColor = "#D8DEE912";
  const squares = [];
  let animationId = null;
  let prevWidth = 0;
  let prevHeight = 0;

  function getRandomPos(width, height) {
    const cols = Math.ceil(width / squareSize);
    const rows = Math.ceil(height / squareSize);

    return {
      x: Math.floor(Math.random() * cols) * squareSize,
      y: Math.floor(Math.random() * rows) * squareSize,
    };
  }

  function createSquares(count, width, height) {
    const currentCount = squares.length;
    if (currentCount >= count) return;

    const needed = count - currentCount;
    for (let i = 0; i < needed; i += 1) {
      const index = currentCount + i;
      const pos = getRandomPos(width, height);
      squares.push({
        ...pos,
        opacity: 0,
        direction: 1,
        delay: index * 30,
        color: colors[index % colors.length],
      });
    }
  }

  function drawGrid(width, height) {
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x += squareSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += squareSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let count = 35;
    if (width < 640) count = 15;
    else if (width < 768) count = 25;

    const shouldExtend = width > prevWidth || height > prevHeight;
    if (shouldExtend) {
      createSquares(count, width, height);
    }

    if (count < squares.length) {
      squares.length = count;
    }

    prevWidth = width;
    prevHeight = height;
  }

  function animate() {
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    drawGrid(width, height);

    squares.forEach((square) => {
      if (square.delay > 0) {
        square.delay -= 1;
        return;
      }

      square.opacity += 0.005 * square.direction;

      if (square.opacity >= 0.5) square.direction = -1;
      if (square.opacity <= 0) {
        square.direction = 1;
        square.opacity = 0;
        Object.assign(square, getRandomPos(width, height));
      }

      ctx.globalAlpha = square.opacity;
      ctx.fillStyle = square.color;
      ctx.fillRect(square.x, square.y, squareSize, squareSize);
    });

    ctx.globalAlpha = 1;
    animationId = window.requestAnimationFrame(animate);
  }

  resize();
  animate();
  window.addEventListener("resize", resize);
  window.addEventListener("beforeunload", () => {
    if (animationId) window.cancelAnimationFrame(animationId);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  renderSocials();
  setupProjectFilters();
  setupAccordions();
  setupContactForm();
  setupGridBackground();
});