
document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const root = document.documentElement;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // =========================================
  // 1. DARK / LIGHT MODE
  // =========================================
  const themeToggle = $("#themeToggle");
  const themeIcon = $("#themeIcon");

  function setTheme(theme) {
    root.dataset.theme = theme;

    if (themeIcon) {
      themeIcon.textContent = theme === "dark" ? "☼" : "☾";
    }

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      );
    }

    try {
      localStorage.setItem("kavya-portfolio-theme", theme);
    } catch (_) {}

    const meta = $('meta[name="theme-color"]');

    if (meta) {
      meta.content = theme === "dark" ? "#070914" : "#f2f5fc";
    }
  }

  let savedTheme = "dark";

  try {
    savedTheme =
      localStorage.getItem("kavya-portfolio-theme") || "dark";
  } catch (_) {}

  setTheme(savedTheme);

  // =========================================
  // 2. NOTIFICATION TOAST
  // =========================================
  const toast = $("#toast");
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme =
        root.dataset.theme === "dark" ? "light" : "dark";

      setTheme(nextTheme);
      showToast(`${nextTheme === "dark" ? "Dark" : "Light"} mode activated`);
    });
  }

  // =========================================
  // 3. MOBILE NAVIGATION
  // =========================================
  const navMenu = $("#navMenu");
  const menuToggle = $("#menuToggle");

  if (navMenu && menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");

      menuToggle.textContent = isOpen ? "×" : "☰";
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // =========================================
  // 4. SCROLL PROGRESS
  // =========================================
  const progressBar = $("#progressBar");

  function updateScrollProgress() {
    if (!progressBar) return;

    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      scrollable > 0
        ? (window.scrollY / scrollable) * 100
        : 0;

    progressBar.style.width = `${progress}%`;
  }

  window.addEventListener("scroll", updateScrollProgress, {
    passive: true
  });

  updateScrollProgress();

  // =========================================
  // 5. SCROLL REVEAL ANIMATIONS
  // =========================================
  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // =========================================
  // 6. ACTIVE NAVIGATION SECTION
  // =========================================
  const sections = $$("main section[id]");
  const navLinks = $$("#navMenu a");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        });
      },
      { rootMargin: "-25% 0px -60% 0px" }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // =========================================
  // 7. HERO TYPING ANIMATION
  // =========================================
  const typingText = $("#typingText");

  const phrases = [
    "digital future",
    "creative interfaces",
    "smart applications",
    "meaningful solutions"
  ];

  if (typingText) {
    if (reduceMotion) {
      typingText.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let characterIndex = 0;
      let deleting = false;

      function typePhrase() {
        if (!typingText.isConnected) return;

        const phrase = phrases[phraseIndex];

        if (!deleting) {
          characterIndex++;
          typingText.textContent = phrase.slice(0, characterIndex);

          if (characterIndex >= phrase.length) {
            deleting = true;
            setTimeout(typePhrase, 1300);
            return;
          }
        } else {
          characterIndex--;
          typingText.textContent = phrase.slice(0, characterIndex);

          if (characterIndex <= 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
          }
        }

        setTimeout(typePhrase, deleting ? 35 : 75);
      }

      typePhrase();
    }
  }

  // =========================================
  // 8. FUTURISTIC PARTICLE BACKGROUND
  // =========================================
  const canvas = $("#particles");
  const ctx = canvas ? canvas.getContext("2d") : null;

  let particles = [];
  let canvasWidth = 0;
  let canvasHeight = 0;
  let animationFrame = null;
  let particlesRunning = false;

  function resizeCanvas() {
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const amount = Math.min(
      85,
      Math.max(25, Math.floor(
        (canvasWidth * canvasHeight) / 15000
      ))
    );

    particles = Array.from({ length: amount }, () => ({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.5 + 0.5
    }));
  }

  function drawParticles() {
    if (!ctx || !canvas || document.hidden || reduceMotion) {
      particlesRunning = false;
      return;
    }

    particlesRunning = true;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const particleColor =
      root.dataset.theme === "light"
        ? "0, 139, 156"
        : "99, 244, 255";

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > canvasWidth) {
        particle.vx *= -1;
      }

      if (particle.y < 0 || particle.y > canvasHeight) {
        particle.vy *= -1;
      }

      ctx.beginPath();
      ctx.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = `rgba(${particleColor}, 0.65)`;
      ctx.fill();

      for (let j = index + 1; j < particles.length; j++) {
        const other = particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 105) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);

          ctx.strokeStyle = `rgba(${particleColor}, ${
            (1 - distance / 105) * 0.12
          })`;

          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    });

    animationFrame = requestAnimationFrame(drawParticles);
  }

  function startParticles() {
    if (!ctx || reduceMotion || particlesRunning) return;
    drawParticles();
  }

  function stopParticles() {
    particlesRunning = false;
    cancelAnimationFrame(animationFrame);
  }

  if (canvas && ctx) {
    resizeCanvas();
    startParticles();

    window.addEventListener("resize", () => {
      resizeCanvas();

      if (!document.hidden) {
        stopParticles();
        startParticles();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopParticles();
      } else {
        startParticles();
      }
    });
  }

  // =========================================
  // 9. PROJECT DEMO MODAL
  // =========================================
  const modal = $("#demoModal");
  const modalBody = $("#modalBody");
  const modalLabel = $("#modalLabel");
  const closeModalButton = $("#closeModal");
  const modalBackdrop = $("#modalBackdrop");

  let previousFocus = null;

  function openModal(title, content) {
    if (!modal || !modalBody) {
      showToast("Project preview is unavailable.");
      return;
    }

    previousFocus = document.activeElement;

    if (modalLabel) {
      modalLabel.textContent = title;
    }

    modalBody.innerHTML = content;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (closeModalButton) {
      closeModalButton.focus();
    }
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  if (closeModalButton) {
    closeModalButton.addEventListener("click", closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", closeModal);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal?.classList.contains("open")) {
      closeModal();
    }
  });

  // =========================================
  // 10. SAFE HTML OUTPUT
  // =========================================
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  // =========================================
  // 11. PERSONAL FINANCE DASHBOARD
  // =========================================
  const transactions = [
    { name: "Monthly allowance", type: "Income", amount: 32000 },
    { name: "Study materials", type: "Expense", amount: 1500 },
    { name: "Transport", type: "Expense", amount: 850 },
    { name: "Food", type: "Expense", amount: 1800 }
  ];

  function money(amount) {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    });
  }

  function renderFinanceDemo() {
    const income = transactions
      .filter((item) => item.type === "Income")
      .reduce((sum, item) => sum + item.amount, 0);

    const expenses = transactions
      .filter((item) => item.type === "Expense")
      .reduce((sum, item) => sum + item.amount, 0);

    const balance = income - expenses;

    return `
      <div class="demo-panel">
        <p class="eyebrow">FINANCE.OS / INTERACTIVE PREVIEW</p>
        <h3>Personal Finance Dashboard</h3>
        <p>Add sample income or expenses to update the totals.</p>

        <div class="demo-stat-grid">
          <div class="demo-stat">
            <small>TOTAL INCOME</small>
            <strong>${money(income)}</strong>
          </div>
          <div class="demo-stat">
            <small>TOTAL EXPENSES</small>
            <strong>${money(expenses)}</strong>
          </div>
          <div class="demo-stat">
            <small>BALANCE</small>
            <strong style="color:var(--green)">
              ${money(balance)}
            </strong>
          </div>
        </div>

        <form id="financeForm" class="demo-form">
          <label>
            Transaction name
            <input name="name" maxlength="45"
              placeholder="e.g. Books" required>
          </label>

          <label>
            Type
            <select name="type">
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>
          </label>

          <label class="full">
            Amount (₹)
            <input name="amount" type="number" min="1"
              max="10000000" placeholder="Enter amount" required>
          </label>

          <button class="button button-primary full" type="submit">
            + Add Transaction
          </button>
        </form>

        <h3>Recent transactions</h3>

        <ul class="demo-list">
          ${transactions.slice().reverse().slice(0, 6).map((item) => `
            <li>
              <span>${escapeHTML(item.name)} · ${item.type}</span>
              <strong style="color:${
                item.type === "Income"
                  ? "var(--green)"
                  : "var(--pink)"
              }">
                ${item.type === "Income" ? "+" : "−"}${money(item.amount)}
              </strong>
            </li>
          `).join("")}
        </ul>

        <p><small>
          Demo only. Transactions are temporary and are not saved to a database.
        </small></p>
      </div>
    `;
  }

  // =========================================
  // 12. SMART STUDY PLANNER
  // =========================================
  let studyTasks = [
    { name: "Revise JavaScript", minutes: 30, done: true },
    { name: "Practice SQL", minutes: 45, done: false },
    { name: "Review assignments", minutes: 20, done: false }
  ];

  function renderStudyDemo() {
    const completed = studyTasks.filter((task) => task.done).length;

    const percent = studyTasks.length
      ? Math.round((completed / studyTasks.length) * 100)
      : 0;

    return `
      <div class="demo-panel">
        <p class="eyebrow">STUDY.AI / FOCUS SPACE</p>
        <h3>Smart Study Planner</h3>
        <p>Add tasks and tick them off when completed.</p>

        <div class="demo-stat-grid">
          <div class="demo-stat">
            <small>TOTAL TASKS</small>
            <strong>${studyTasks.length}</strong>
          </div>
          <div class="demo-stat">
            <small>COMPLETED</small>
            <strong>${completed}</strong>
          </div>
          <div class="demo-stat">
            <small>PROGRESS</small>
            <strong>${percent}%</strong>
          </div>
        </div>

        <div class="progress-track">
          <span style="width:${percent}%"></span>
        </div>

        <ul class="demo-list">
          ${studyTasks.map((task, index) => `
            <li>
              <label style="display:flex;align-items:center;gap:10px;flex:1">
                <input type="checkbox"
                  data-task-index="${index}"
                  ${task.done ? "checked" : ""}>
                <span style="${
                  task.done
                    ? "text-decoration:line-through;opacity:.65"
                    : ""
                }">
                  ${escapeHTML(task.name)}
                </span>
              </label>
              <small>${task.minutes} min</small>
            </li>
          `).join("")}
        </ul>

        <form id="studyForm" class="demo-form">
          <label>
            Study task
            <input name="task" maxlength="60"
              placeholder="e.g. Learn Python" required>
          </label>

          <label>
            Minutes
            <input name="minutes" type="number" min="5"
              max="600" value="30" required>
          </label>

          <button class="button button-primary full" type="submit">
            + Add Study Task
          </button>
        </form>

        <p><small>
          Demo only. Tasks remain in page memory, not in a database.
        </small></p>
      </div>
    `;
  }

  // =========================================
  // 13. STUDENT REPORT MANAGEMENT
  // =========================================
  let students = [
    { name: "Student A", marks: 87 },
    { name: "Student B", marks: 76 },
    { name: "Student C", marks: 92 }
  ];

  function getGrade(marks) {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 35) return "D";
    return "F";
  }

  function renderReportDemo() {
    const average = students.length
      ? Math.round(
          students.reduce((sum, student) => sum + student.marks, 0) /
          students.length
        )
      : 0;

    const passRate = students.length
      ? Math.round(
          students.filter((student) => student.marks >= 35).length /
          students.length * 100
        )
      : 0;

    return `
      <div class="demo-panel">
        <p class="eyebrow">STUDENT.DB / RECORDS</p>
        <h3>Student Report Management</h3>
        <p>Add students and marks to calculate grades.</p>

        <div class="demo-stat-grid">
          <div class="demo-stat">
            <small>STUDENTS</small>
            <strong>${students.length}</strong>
          </div>
          <div class="demo-stat">
            <small>CLASS AVERAGE</small>
            <strong>${average}%</strong>
          </div>
          <div class="demo-stat">
            <small>PASS RATE</small>
            <strong>${passRate}%</strong>
          </div>
        </div>

        <form id="reportForm" class="demo-form">
          <label>
            Student name
            <input name="name" maxlength="45"
              placeholder="Enter student name" required>
          </label>

          <label>
            Marks (out of 100)
            <input name="marks" type="number" min="0"
              max="100" required>
          </label>

          <button class="button button-primary full" type="submit">
            + Add Student
          </button>
        </form>

        <table class="demo-table">
          <thead>
            <tr>
              <th>STUDENT</th>
              <th>MARKS</th>
              <th>GRADE</th>
            </tr>
          </thead>
          <tbody>
            ${students.map((student) => `
              <tr>
                <td>${escapeHTML(student.name)}</td>
                <td>${student.marks}/100</td>
                <td>${getGrade(student.marks)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <p><small>
          Demo only. This is sample data, not a connected student database.
        </small></p>
      </div>
    `;
  }

  // =========================================
  // 14. NOTES STORE PROJECT
  // =========================================
  const notes = {
    title: "Notes Store",
    description:
      "A student-focused resource platform for organizing subject notes and learning materials.",
    details: [
      "Organize study materials by subject and category.",
      "Browse web development and database learning resources.",
      "Provide PDF notes and revision materials.",
      "Possible technologies: HTML, CSS, JavaScript, Flask and SQL."
    ]
  };

  function renderNotesDemo() {
    return `
      <div class="demo-panel">
        <p class="eyebrow">NOTES.STORE / PROJECT PREVIEW</p>
        <h3>${escapeHTML(notes.title)}</h3>
        <p>${escapeHTML(notes.description)}</p>

        <h3>Project features</h3>

        <ul class="demo-list">
          ${notes.details.map((detail) => `
            <li>${escapeHTML(detail)}</li>
          `).join("")}
        </ul>

        <p><small>
          Project concept preview. Actual PDF downloads, authentication
          and database features require implementation.
        </small></p>
      </div>
    `;
  }

  // =========================================
  // 15. OPEN PROJECT DEMOS
  // =========================================
  function openProjectDemo(project) {
    switch (project) {
      case "finance":
        openModal(
          "FINANCE.OS / DEMO",
          renderFinanceDemo()
        );
        break;

      case "study":
        openModal(
          "STUDY.AI / DEMO",
          renderStudyDemo()
        );
        break;

      case "report":
        openModal(
          "STUDENT.DB / DEMO",
          renderReportDemo()
        );
        break;

      case "notes":
        openModal(
          "NOTES.STORE / DEMO",
          renderNotesDemo()
        );
        break;

      default:
        showToast("Project demo not available.");
    }
  }

  $$(".demo-button").forEach((button) => {
    button.addEventListener("click", () => {
      openProjectDemo(button.dataset.demo);
    });
  });

  // =========================================
  // 16. HANDLE DEMO FORM SUBMISSIONS
  // =========================================
  if (modalBody) {
    modalBody.addEventListener("submit", (event) => {
      event.preventDefault();

      const form = event.target;

      if (form.id === "financeForm") {
        const data = new FormData(form);
        const name = String(data.get("name") || "").trim();
        const type = String(data.get("type") || "Expense");
        const amount = Number(data.get("amount"));

        if (
          !name ||
          !["Income", "Expense"].includes(type) ||
          !Number.isFinite(amount) ||
          amount <= 0 ||
          amount > 10000000
        ) {
          showToast("Enter valid transaction details.");
          return;
        }

        transactions.push({ name, type, amount });

        openModal(
          "FINANCE.OS / DEMO",
          renderFinanceDemo()
        );

        showToast("Sample transaction added!");
      }

      if (form.id === "studyForm") {
        const data = new FormData(form);
        const name = String(data.get("task") || "").trim();
        const minutes = Number(data.get("minutes"));

        if (
          !name ||
          !Number.isInteger(minutes) ||
          minutes < 5 ||
          minutes > 600
        ) {
          showToast("Enter a task and 5–600 minutes.");
          return;
        }

        studyTasks.push({
          name,
          minutes,
          done: false
        });

        openModal(
          "STUDY.AI / DEMO",
          renderStudyDemo()
        );

        showToast("Study task added!");
      }

      if (form.id === "reportForm") {
        const data = new FormData(form);
        const name = String(data.get("name") || "").trim();
        const marks = Number(data.get("marks"));

        if (
          !name ||
          !Number.isInteger(marks) ||
          marks < 0 ||
          marks > 100
        ) {
          showToast("Enter a name and marks from 0 to 100.");
          return;
        }

        students.push({ name, marks });

        openModal(
          "STUDENT.DB / DEMO",
          renderReportDemo()
        );

        showToast(`Student added. Grade: ${getGrade(marks)}`);
      }
    });

    // =======================================
    // 17. STUDY TASK CHECKBOXES
    // =======================================
    modalBody.addEventListener("change", (event) => {
      const checkbox = event.target.closest("[data-task-index]");

      if (!checkbox) return;

      const index = Number(checkbox.dataset.taskIndex);

      if (studyTasks[index]) {
        studyTasks[index].done = checkbox.checked;

        openModal(
          "STUDY.AI / DEMO",
          renderStudyDemo()
        );
      }
    });
  }

  // =========================================
  // 18. SUBTLE 3D TILT EFFECT
  // =========================================
  const tiltCards = $$(".project-card, .skill-panel");

  if (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !reduceMotion
  ) {
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * 3;
        const rotateX = (0.5 - y) * 3;

        card.style.transform =
          `perspective(900px) rotateX(${rotateX}deg) ` +
          `rotateY(${rotateY}deg) translateY(-3px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  // =========================================
  // 19. AUTOMATIC FOOTER YEAR
  // =========================================
  const yearElement = $("#year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
