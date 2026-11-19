const form = document.querySelector("#chat-form");
const input = document.querySelector("#question");
const send = document.querySelector("#send");
const welcome = document.querySelector("#welcome");
const messages = document.querySelector("#messages");

function addMessage(role, text, className = "") {
  const row = document.createElement("div");
  row.className = `message ${role} ${className}`;
  const avatar = document.createElement("span");
  avatar.className = "avatar";
  avatar.textContent = role === "user" ? "Y" : "K";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  row.append(avatar, bubble);
  messages.append(row);
  return { row, bubble };
}

async function ask(question) {
  const clean = question.trim();
  if (!clean || send.disabled) return;
  welcome.hidden = true;
  addMessage("user", clean);
  input.value = "";
  input.style.height = "auto";
  send.disabled = true;
  const pending = addMessage("assistant", "Searching your company knowledge base…", "pending");
  pending.bubble.classList.add("typing");
  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: clean }),
    });
    const result = await response.json();
    pending.bubble.classList.remove("typing");
    pending.bubble.textContent = response.ok ? result.answer : `I couldn't get an answer. ${result.error || "Please try again."}`;
  } catch {
    pending.bubble.classList.remove("typing");
    pending.bubble.textContent = "Couldn't connect to the answer service. Check that the local server is running, then try again.";
  } finally {
    pending.row.classList.remove("pending");
    send.disabled = false;
    input.focus();
    messages.scrollIntoView({ behavior: "smooth", block: "end" });
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  ask(input.value);
});
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
});
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});
document.querySelector(".suggestion").addEventListener("click", (event) => ask(event.currentTarget.textContent.replace("↗", "").trim()));
