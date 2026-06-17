const thoughtButton =
  document.querySelector("#thought-button")

const analyzeButton =
  document.querySelector("#analyze-button")


analyzeButton.addEventListener("click", () => {
  analyzeButton.textContent = "Grr"
});

thoughtButton.addEventListener("click", () => {
  thoughtButton.classList.toggle("active")
  if (thoughtButton.classList.contains("active")) {
    thoughtButton.textContent = "Gedanke";
  } else {
    thoughtButton.textContent = "Miau";
    alert("Grrrr");
  }
});

const homeButton =
  document.querySelector("#home-button");

homeButton.addEventListener("click", () => {
  window.location.href = "index.html";
});
