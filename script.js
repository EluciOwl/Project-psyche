// I get it! -> when I'm on thoughts.html and klick on "home-thougts-button" he'll find it GREAT!
// BUT!!! -> at the same time on thoughts.html he CAN'T find "home-button" and "thought-button" because it's on "index.html"
// SOOO... -> the first line of code doesen't work when I'm on "thoughts.html" -> returns null -> CRASH -> code below will never happen
// consequently: click on home-thoughts-button nothing will happen!!!
// solution: I have to check first -> is it there? (YES)-> then do... / (NO)-> skip that part move to next code below 

// index.html
const homeButton = document.getElementById("home-button");
if (homeButton) {
  homeButton.addEventListener("click", () => {
    // klicked -> go to index.html
    window.location.href = "index.html";
  });
}
// doesen't exist? -> just skip 

const thoughtsButton = document.getElementById("thoughts-button");
if (thoughtsButton) {
  thoughtsButton.addEventListener("click", () => {
    window.location.href = "thoughts.html";
  });
}

// thoughts.html buttons
const homeThoughtButton = document.getElementById("home-thoughts-button");
if (homeThoughtButton) {
  homeThoughtButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// cointainer to collect all thought-inputs
const thoughtsContainer = document.getElementById("thoughts-container");
// Thoughts from input
const thoughtInput = document.querySelector("#thought-input");

// when thoughtInput -> this code can run, when not skip
if (thoughtInput) {
// "=" -> sets value | "===" is this equal to...?"
thoughtInput.addEventListener("keydown", (event) => {
  // when Enter -> Create cloud, img, text
  if (event.key === "Enter") {
    const cloud = document.createElement("div");
    cloud.classList.add("thought-cloud");

    const img = document.createElement("img");
    img.src = "assets/images/ai-generated/thought.png";

    const text = document.createElement("span");
    text.classList.add("thought-text");
    text.textContent = thoughtInput.value;

    // appending all
    cloud.appendChild(img);
    cloud.appendChild(text);
    thoughtsContainer.appendChild(cloud);
  }
});
}



