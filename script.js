"use strict";

// ========================================
// ELEMENTS
// ========================================

const proposalScreen = document.getElementById("proposal-screen");
const dateScreen = document.getElementById("date-screen");
const confirmedScreen = document.getElementById("confirmed-screen");

const buttonRow = document.getElementById("button-row");
const truthButton = document.getElementById("truth-button");
const dareButton = document.getElementById("dare-button");
const playfulMessage = document.getElementById("playful-message");

const dateForm = document.getElementById("date-form");
const dateInput = document.getElementById("date-input");
const timeInput = document.getElementById("time-input");

const summaryDate = document.getElementById("summary-date");
const summaryTime = document.getElementById("summary-time");
const summaryActivity = document.getElementById("summary-activity");
const summaryNote = document.getElementById("summary-note");

const sendPlanButton = document.getElementById("send-plan-button");
const sendEmailButton = document.getElementById("send-email-button");
const backButton = document.getElementById("back-button");
const shareMessage = document.getElementById("share-message");

const heartLayer = document.getElementById("heart-layer");
const toast = document.getElementById("toast");


const WHATSAPP_NUMBER = "8801580367168";


const EMAIL_ADDRESS = "mahmudaitraining@gmail.com";


// ========================================
// HELPER FUNCTIONS
// ========================================

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(toastTimer);

  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}


function showScreen(screenToShow) {
  const screens = [
    proposalScreen,
    dateScreen,
    confirmedScreen
  ];

  screens.forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ========================================
// TRUTH BUTTON: RANDOM ESCAPE
// ========================================

const truthMessages = [
  "Almost got it! Truth is playing shy. 🙈",
  "Oops! Truth ran away again. Dare is right there! ♡",
  "Truth isn't ready to answer that... 💨",
  "Such a slippery little Truth! Try Dare 💗",
  "Too close! Truth has disappeared again. 😅",
  "Truth says: catch me if you can! 🙈",
  "That was close! Dare is waiting for you. 💌"
];

let lastMessageIndex = -1;

const lastPointer = {
  x: 0,
  y: 0,
  active: false
};


// Remember the pointer position so Truth can
// avoid jumping directly underneath the pointer.

document.addEventListener("pointermove", (event) => {
  lastPointer.x = event.clientX;
  lastPointer.y = event.clientY;
  lastPointer.active = true;
});


function updateTruthMessage() {
  let nextIndex = Math.floor(
    Math.random() * truthMessages.length
  );

  // Avoid repeating the same message immediately.
  if (truthMessages.length > 1 && nextIndex === lastMessageIndex) {
    nextIndex = (nextIndex + 1) % truthMessages.length;
  }

  lastMessageIndex = nextIndex;
  playfulMessage.textContent = truthMessages[nextIndex];
}


function moveTruthButton() {
  const rowRect = buttonRow.getBoundingClientRect();

  const truthWidth = truthButton.offsetWidth;
  const truthHeight = truthButton.offsetHeight;

  const rowWidth = buttonRow.clientWidth;
  const rowHeight = buttonRow.clientHeight;

  const maxX = Math.max(8, rowWidth - truthWidth - 8);
  const maxY = Math.max(8, rowHeight - truthHeight - 8);

  // Find the Dare button's position inside the same container.
  const dareX = dareButton.offsetLeft;
  const dareY = dareButton.offsetTop;
  const dareWidth = dareButton.offsetWidth;
  const dareHeight = dareButton.offsetHeight;

  let chosenPosition = null;

  // Try several random positions.
  // Avoid overlapping Dare or jumping underneath the pointer.
  for (let attempt = 0; attempt < 80; attempt++) {
    const x = 8 + Math.random() * Math.max(0, maxX - 8);
    const y = 8 + Math.random() * Math.max(0, maxY - 8);

    const overlapsDare =
      x < dareX + dareWidth + 12 &&
      x + truthWidth > dareX - 12 &&
      y < dareY + dareHeight + 12 &&
      y + truthHeight > dareY - 12;

    const centerX = rowRect.left + x + truthWidth / 2;
    const centerY = rowRect.top + y + truthHeight / 2;

    const tooCloseToPointer =
      lastPointer.active &&
      Math.abs(centerX - lastPointer.x) < 75 &&
      Math.abs(centerY - lastPointer.y) < 65;

    if (!overlapsDare && !tooCloseToPointer) {
      chosenPosition = { x, y };
      break;
    }
  }

  // Fallback: position Truth below Dare if necessary.
  if (!chosenPosition) {
    chosenPosition = {
      x: Math.max(8, Math.min(maxX, dareX - truthWidth - 14)),
      y: Math.max(8, Math.min(maxY, dareY + dareHeight + 12))
    };

    // On a smaller screen, use an alternate position.
    if (
      chosenPosition.y + truthHeight > rowHeight ||
      (
        chosenPosition.x < dareX + dareWidth &&
        chosenPosition.x + truthWidth > dareX
      )
    ) {
      chosenPosition = {
        x: 8,
        y: Math.max(8, maxY)
      };
    }
  }

  truthButton.style.left = `${chosenPosition.x}px`;
  truthButton.style.top = `${chosenPosition.y}px`;

  updateTruthMessage();
}


// Move away when the mouse approaches Truth.
truthButton.addEventListener("pointerenter", (event) => {
  if (event.pointerType === "mouse") {
    moveTruthButton();
  }
});


// Moving on pointerdown prevents ordinary mouse/touch clicks.
// This also works on touchscreens.
truthButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  moveTruthButton();
});


// Block activation even if a click event is generated.
truthButton.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();

  moveTruthButton();
});


// Keep keyboard interaction consistent with the playful effect.
truthButton.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    moveTruthButton();
  }
});


// If Truth receives keyboard focus, move it as well.
truthButton.addEventListener("focus", () => {
  moveTruthButton();
});


// ========================================
// FLOATING HEART EFFECT
// ========================================

function launchHearts(count = 20) {
  const heartSymbols = [
    "♥",
    "♡",
    "💗",
    "💕",
    "✦"
  ];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");

    particle.className = "heart-particle";
    particle.textContent =
      heartSymbols[
        Math.floor(Math.random() * heartSymbols.length)
      ];

    particle.style.setProperty(
      "--x",
      `${Math.random() * 100}%`
    );

    particle.style.setProperty(
      "--size",
      `${12 + Math.random() * 17}px`
    );

    particle.style.setProperty(
      "--duration",
      `${3 + Math.random() * 3}s`
    );

    particle.style.setProperty(
      "--delay",
      `${Math.random() * 0.7}s`
    );

    particle.style.setProperty(
      "--drift",
      `${-70 + Math.random() * 140}px`
    );

    particle.addEventListener("animationend", () => {
      particle.remove();
    }, { once: true });

    heartLayer.appendChild(particle);
  }
}


// ========================================
// DARE: ACCEPT THE PROPOSAL
// ========================================

dareButton.addEventListener("click", () => {
  showScreen(dateScreen);

  launchHearts(26);

  showToast("A little dare, a very happy heart! 💗");

  // Start the date selection with today's date as the minimum.
  // Use the visitor's local calendar date.
  dateInput.min = getLocalDateString();
});


// ========================================
// DATE INPUT HELPERS
// ========================================

function getLocalDateString() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function formatDate(dateString) {
  // Using local midnight avoids UTC date shifting.
  const selectedDate = new Date(`${dateString}T00:00:00`);

  return selectedDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}


// ========================================
// CONFIRM DATE PLAN
// ========================================

dateForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedDate = dateInput.value;
  const selectedTime = timeInput.value;

  const selectedActivity = dateForm.querySelector(
    'input[name="activity"]:checked'
  );

  const note = document
    .getElementById("little-note")
    .value
    .trim();

  // Basic validation.
  if (!selectedDate) {
    showToast("Please choose our date first. 💌");
    dateInput.focus();
    return;
  }

  if (selectedDate < getLocalDateString()) {
    showToast("Please choose today or a future date. ♡");
    dateInput.focus();
    return;
  }

  if (!selectedActivity) {
    showToast("Please choose a date idea first. 💗");
    return;
  }

  // Fill in the confirmation summary.
  summaryDate.textContent = formatDate(selectedDate);
  summaryTime.textContent = selectedTime;
  summaryActivity.textContent = selectedActivity.value;

  summaryNote.textContent = note
    ? `A little extra: ${note}`
    : "";

  summaryNote.hidden = !note;

  shareMessage.textContent = "";

  // Show the final confirmation screen.
  showScreen(confirmedScreen);

  launchHearts(32);

  showToast("Our date plan is confirmed! 💖");
});


// ========================================
// CHANGE DATE PLAN
// ========================================

backButton.addEventListener("click", () => {
  showScreen(dateScreen);

  shareMessage.textContent = "";
});


// ========================================
// PREPARE SHAREABLE DATE MESSAGE
// ========================================

function buildDatePlanMessage() {
  const noteElement = document.getElementById("little-note");
  const note = noteElement.value.trim();

  const lines = [
    "💌 OUR LITTLE DATE PLAN 💗",
    "",
    "You said yes, and we made a plan!",
    "",
    `📅 Date: ${summaryDate.textContent}`,
    `🕰️ Time: ${summaryTime.textContent}`,
    `✨ Date idea: ${summaryActivity.textContent}`
  ];

  if (note) {
    lines.push(`💬 Little note: ${note}`);
  }

  lines.push(
    "",
    "One date, two smiles. See you there! ♡"
  );

  return lines.join("\n");
}


// ========================================
// SEND VIA YOUR WHATSAPP NUMBER
// ========================================

sendPlanButton.addEventListener("click", () => {
  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
    showToast("Please add your correct WhatsApp number in script.js.");
    return;
  }

  const message = buildDatePlanMessage();

  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  const whatsappWindow = window.open(whatsappURL, "_blank");

  if (whatsappWindow) {
    whatsappWindow.opener = null;

    shareMessage.textContent =
      "WhatsApp opened! Review your date plan and press Send. 💗";
  } else {
    showToast("Please allow pop-ups to open WhatsApp.");
  }
});


// ========================================
// SEND VIA YOUR EMAIL ADDRESS
// ========================================

sendEmailButton.addEventListener("click", () => {
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(EMAIL_ADDRESS) ||
    EMAIL_ADDRESS === "your-email@example.com"
  ) {
    showToast("Please add your correct email address in script.js.");
    return;
  }

  const subject = "Our Little Date Plan 💗";
  const message = buildDatePlanMessage();

  const emailURL =
    `mailto:${EMAIL_ADDRESS}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(message)}`;

  shareMessage.textContent =
    "Your email draft is ready. Review it and press Send. 💌";

  window.location.href = emailURL;
});


// ========================================
// INITIAL SETUP
// ========================================

// Ensure the date picker never allows a past date.
dateInput.min = getLocalDateString();