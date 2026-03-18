let studyData = null;
let currentCardIndex = 0;

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO_DATA = {
  flashcards: [
    { question: "What is Photosynthesis?", answer: "The process by which green plants convert sunlight, water, and CO₂ into glucose and oxygen." },
    { question: "Where does photosynthesis take place?", answer: "In the chloroplasts of plant cells." },
    { question: "What is the green pigment in plants called?", answer: "Chlorophyll." },
    { question: "What are the two stages of photosynthesis?", answer: "The light-dependent reactions and the Calvin cycle (light-independent reactions)." },
    { question: "What gas do plants absorb during photosynthesis?", answer: "Carbon dioxide (CO₂)." },
    { question: "What gas is released as a byproduct of photosynthesis?", answer: "Oxygen (O₂)." },
    { question: "What is the overall equation for photosynthesis?", answer: "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂" },
  ],
  quiz: [
    {
      question: "Which organelle is responsible for photosynthesis?",
      options: { A: "Mitochondria", B: "Nucleus", C: "Chloroplast", D: "Ribosome" },
      correct: "C"
    },
    {
      question: "What does chlorophyll absorb to power photosynthesis?",
      options: { A: "Water", B: "Light energy", C: "Carbon dioxide", D: "Glucose" },
      correct: "B"
    },
    {
      question: "What is produced during the light-dependent reactions?",
      options: { A: "Glucose", B: "CO₂", C: "ATP and NADPH", D: "Water" },
      correct: "C"
    },
    {
      question: "Which of the following is NOT a raw material for photosynthesis?",
      options: { A: "Water", B: "Sunlight", C: "Oxygen", D: "Carbon dioxide" },
      correct: "C"
    },
    {
      question: "What is the Calvin cycle also known as?",
      options: { A: "Light reactions", B: "Krebs cycle", C: "Light-independent reactions", D: "Glycolysis" },
      correct: "C"
    },
  ],
  summary: [
    "Photosynthesis is the process plants use to convert light energy into chemical energy stored as glucose.",
    "It occurs in the chloroplasts, specifically using the green pigment chlorophyll.",
    "The process requires carbon dioxide (CO₂), water (H₂O), and sunlight as inputs.",
    "It produces glucose (C₆H₁₂O₆) as food for the plant and oxygen (O₂) as a byproduct.",
    "Photosynthesis has two stages: light-dependent reactions and the Calvin cycle (light-independent).",
  ],
  fill_in_the_blank: [
    { sentence: "Photosynthesis takes place in the ___ of plant cells.", answer: "chloroplasts" },
    { sentence: "The green pigment that captures light energy is called ___.", answer: "chlorophyll" },
    { sentence: "Plants absorb ___ from the air during photosynthesis.", answer: "carbon dioxide" },
    { sentence: "The byproduct gas released during photosynthesis is ___.", answer: "oxygen" },
    { sentence: "The Calvin cycle is also called the light-___ reactions.", answer: "independent" },
    { sentence: "The chemical energy produced by photosynthesis is stored as ___.", answer: "glucose" },
    { sentence: "Water and CO₂ are the two main ___ materials for photosynthesis.", answer: "raw" },
  ]
};

// ─── Generate ────────────────────────────────────────────────────────────────

function generate() {
  const input = document.getElementById("userInput").value.trim();
  if (!input) {
    showError("Please enter a topic or paste your notes.");
    return;
  }

  hideError();
  showLoader(true);
  hideOutput();

  // Simulate a brief loading delay then load demo data
  setTimeout(() => {
    studyData = DEMO_DATA;
    renderAll();
    showOutput();
    showTab("flashcards");
    showLoader(false);
  }, 800);
}

// ─── Render ───────────────────────────────────────────────────────────────────

function renderAll() {
  renderFlashcards();
  renderQuiz();
  renderSummary();
  renderBlanks();
}

function renderFlashcards() {
  currentCardIndex = 0;
  updateCard();
}

function updateCard() {
  const cards = studyData.flashcards;
  if (!cards || cards.length === 0) return;

  const card = cards[currentCardIndex];
  document.getElementById("cardFront").textContent = card.question;
  document.getElementById("cardBack").textContent = card.answer;
  document.getElementById("cardCounter").textContent = `Card ${currentCardIndex + 1} of ${cards.length}`;

  // Reset flip
  document.getElementById("flashcardInner").classList.remove("flipped");
}

function flipCard() {
  document.getElementById("flashcardInner").classList.toggle("flipped");
}

function nextCard() {
  const cards = studyData.flashcards;
  currentCardIndex = (currentCardIndex + 1) % cards.length;
  updateCard();
}

function prevCard() {
  const cards = studyData.flashcards;
  currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
  updateCard();
}

function renderQuiz() {
  const container = document.getElementById("quizContainer");
  container.innerHTML = "";
  document.getElementById("quizScore").classList.add("hidden");
  document.getElementById("submitQuizBtn").classList.remove("hidden");

  studyData.quiz.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "quiz-question";
    div.innerHTML = `<p>${i + 1}. ${q.question}</p>`;

    Object.entries(q.options).forEach(([key, val]) => {
      const label = document.createElement("label");
      label.className = "quiz-option";
      label.innerHTML = `
        <input type="radio" name="q${i}" value="${key}" />
        <span><strong>${key}.</strong> ${val}</span>
      `;
      div.appendChild(label);
    });

    container.appendChild(div);
  });
}

function submitQuiz() {
  const questions = studyData.quiz;
  let score = 0;

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const options = document.querySelectorAll(`.quiz-question:nth-child(${i + 1}) .quiz-option`);

    options.forEach((opt) => {
      const val = opt.querySelector("input").value;
      if (val === q.correct) opt.classList.add("correct");
      if (selected && selected.value === val && val !== q.correct) opt.classList.add("incorrect");
    });

    if (selected && selected.value === q.correct) score++;

    // Disable all radios for this question
    document.querySelectorAll(`input[name="q${i}"]`).forEach((r) => (r.disabled = true));
  });

  const scoreBox = document.getElementById("quizScore");
  scoreBox.textContent = `You scored ${score} out of ${questions.length}!`;
  scoreBox.classList.remove("hidden");
  document.getElementById("submitQuizBtn").classList.add("hidden");
}

function renderSummary() {
  const list = document.getElementById("summaryList");
  list.innerHTML = "";
  studyData.summary.forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    list.appendChild(li);
  });
}

function renderBlanks() {
  const container = document.getElementById("blanksContainer");
  container.innerHTML = "";
  document.getElementById("blanksScore").classList.add("hidden");

  studyData.fill_in_the_blank.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "blank-item";
    div.dataset.answer = item.answer.toLowerCase().trim();

    const sentence = item.sentence.replace("___", '<strong>___</strong>');
    div.innerHTML = `
      <p>${i + 1}. ${sentence}</p>
      <input type="text" placeholder="Type the missing word..." id="blank${i}" />
      <div class="blank-feedback" id="feedback${i}"></div>
    `;
    container.appendChild(div);
  });
}

function checkBlanks() {
  const items = document.querySelectorAll(".blank-item");
  let score = 0;

  items.forEach((item, i) => {
    const input = document.getElementById(`blank${i}`);
    const feedback = document.getElementById(`feedback${i}`);
    const userAnswer = input.value.toLowerCase().trim();
    const correct = item.dataset.answer;

    input.disabled = true;

    if (userAnswer === correct) {
      item.classList.add("correct");
      feedback.textContent = "Correct!";
      feedback.style.color = "#276749";
      score++;
    } else {
      item.classList.add("incorrect");
      feedback.textContent = `Incorrect. The answer is: "${correct}"`;
      feedback.style.color = "#c53030";
    }
  });

  const scoreBox = document.getElementById("blanksScore");
  scoreBox.textContent = `You got ${score} out of ${items.length} correct!`;
  scoreBox.classList.remove("hidden");
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function showTab(tab) {
  const tabMap = {
    flashcards: "tab-flashcards",
    quiz: "tab-quiz",
    summary: "tab-summary",
    blanks: "tab-blanks",
  };

  Object.values(tabMap).forEach((id) => {
    document.getElementById(id).classList.add("hidden");
  });

  document.getElementById(tabMap[tab]).classList.remove("hidden");

  document.querySelectorAll(".tab-btn").forEach((btn, i) => {
    btn.classList.remove("active");
    if (Object.keys(tabMap)[i] === tab) btn.classList.add("active");
  });
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

function showLoader(state) {
  document.getElementById("loader").classList.toggle("hidden", !state);
}

function showOutput() {
  document.getElementById("outputSection").classList.remove("hidden");
}

function hideOutput() {
  document.getElementById("outputSection").classList.add("hidden");
}

function showError(msg) {
  const box = document.getElementById("errorBox");
  box.textContent = msg;
  box.classList.remove("hidden");
}

function hideError() {
  document.getElementById("errorBox").classList.add("hidden");
}

// Allow Enter key to trigger generate
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("userInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.ctrlKey) generate();
  });
});
