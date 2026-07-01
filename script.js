// Thoughts from input field
const thoughtInput = document.getElementById("thought-input-box");
// readyButton that appears after 4 entered thoughts
const readyButton = document.getElementById("ready-button");
// collecting thoughts via input
let thoughtsArray = [];

const MAX_THOUGHTS = 4;

// Position of the recreated Clouds on emotions.html
let topSpacing = 200;
let rightSpacing = 80;
let gapBetween = 180

let emotionsAmount = 10;
// Naviagtions
function IndexNavigation() {
  const homeButton = document.getElementById("home-button");
  if (homeButton) {
    homeButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  const thoughtsButton = document.getElementById("thoughts-button");
  if (thoughtsButton) {
    thoughtsButton.addEventListener("click", () => {
      window.location.href = "thoughts.html";
    });
  }

  // thoughts.html buttons
  const homeThoughtButton = document.querySelector(".home-colored-button");
  if (homeThoughtButton) {
    homeThoughtButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
}
function readyToEmotionsNavigation() {
  // move from readyButton -> emotions.html
  if (readyButton) {
    readyButton.addEventListener("click", () => {
      window.location.href = "emotions.html";
    })
  }
}

// Visual effects
function appearingInputText() {
  if (thoughtInput) {
    // creating the Text inside the textbox letter by letter
    const fullText = "What's on your mind?";
    let letters = 0;

    // runs every 120ms
    const typing = setInterval(() => {
      // from position 0, cut letters -> (0,3) = "Wha"
      thoughtInput.placeholder = fullText.slice(0, letters);
      letters++

      // cut letters more than the whole Text?
      if (letters > fullText.length) {
        clearInterval(typing);
      }
    }, 120);
  }
}
function sparkleEffect(sparkleing) {

  let sparkleInterval = null;

  sparkleing.addEventListener("mouseenter", () => {
    sparkleInterval = setInterval(() => {
      const particleDot = document.createElement("div");
      // give particleDot the class: "particle" used in style.css
      particleDot.classList.add("particle")
      // create position of particles randomly 0-100% -> horizontal 
      particleDot.style.left = Math.random() * 100 + "%";
      // particles rise from bottom
      particleDot.style.bottom = "0px";
      particleDot.style.background = "rgb(204, 73, 255)";
      // ad it to stage
      sparkleing.appendChild(particleDot);
      setTimeout(() => particleDot.remove(), 1000);
    }, 50);
  });

  sparkleing.addEventListener("mouseleave", () => {
    clearInterval(sparkleInterval);
  })
}
function counterAppearing(thoughtCounter, inputCounter) {
  // thoughtCounter raises every cycle
  thoughtCounter.textContent = inputCounter.toString() + "/" + MAX_THOUGHTS.toString();

  // thoughtCounter will wobble and goes green when MAX_THOUGHTS
  if (inputCounter > 3) {
    thoughtCounter.style.filter = "brightness(1.3)";
    thoughtCounter.classList.add("wobble");
  }
  else if (inputCounter > 2) {
    thoughtCounter.style.filter = "brightness(1.2)";
  }
  else if (inputCounter > 1) {
    thoughtCounter.style.filter = "brightness(1.1)";
  }
  else {
    thoughtCounter.style.filter = "brightness(1)";
  }
}

// Page feature
function featureThoughts() {
  let sparkleEffectSwitch = true;
  // cointainer to collect all thought-inputs
  const thoughtsContainer = document.getElementById("thoughts-container");
  // display counter for entered thoughts
  const thoughtCounter = document.getElementById("thought-counter");

  // when thoughtInput -> this code can run, not? -> skip
  if (thoughtInput) {
    let inputCounter = 0;

    thoughtCounter.textContent = inputCounter.toString() + "/" + MAX_THOUGHTS.toString();

    // listen for "keydown"
    thoughtInput.addEventListener("keydown", (event) => {

      // when browser gives me Enter -> div, img, span
      if (event.key === "Enter" && inputCounter < MAX_THOUGHTS) {
        inputCounter++;

        counterAppearing(thoughtCounter, inputCounter);
        createFloatingClouds(thoughtInput.value, thoughtsContainer);

        thoughtsArray.push(thoughtInput.value);
        // my array  ->  JSON.stringify  ->  a JSON string  ->  localStorage holds it
        localStorage.setItem("thoughts", JSON.stringify(thoughtsArray));
        // clearing the text-field
        thoughtInput.value = "";
      }
      if (inputCounter === MAX_THOUGHTS && sparkleEffectSwitch) {
        // creats sparkle effect for readyButton
        const sparkleVisual = document.getElementById("sparkle-effect");
        readyButton.style.visibility = "visible";
        sparkleEffect(sparkleVisual);
        sparkleEffectSwitch = false;
      }
    });
  }
}
function thoughtsRecreateOnDocEmotions() {
  const thoughtsCollectedContainer = document.getElementById("thoughts-collected-container");

  if (thoughtsCollectedContainer) {
    let thoughtsJson = localStorage.getItem("thoughts");
    // || [] protects .length from crashing if parse gave nothing!
    thoughtsArray = JSON.parse(thoughtsJson) || [];

    // that cloud i'm dragging right now
    let activeCloud = null;
    // dragging?
    let isDragging = false;

    // set offset in X and Y to adjust mouse while dragging, keep mouse where I started to grap
    let offsetX = 0;
    let offsetY = 0;

    // gap between the recreated Clouds
    let gapHeight = 0;

    // when cloud in zone
    let cloudInZone = null;

    for (let thoughtsNumber = 0; thoughtsNumber < thoughtsArray.length; thoughtsNumber++) {
      // Store created cloud
      const cloud = createFloatingClouds(thoughtsArray[thoughtsNumber], thoughtsCollectedContainer);

      // Start position of recreated Clouds at the right of the screen
      let positionCloud = cloud;
      let topNew = topSpacing + gapHeight + "px";
      positionCloud.style.right = rightSpacing + "px";
      positionCloud.style.top = topNew;
      gapHeight += gapBetween;


      // When I klick, the returned clouds I built before getting chatched by Eventlistener
      // When the event happens, I'm dragging
      cloud.addEventListener("mousedown", (event) => {
        activeCloud = cloud;
        isDragging = true;

        // No 🚫 "can't drop here-Symbol" is appearing!
        event.preventDefault();

        // hands back an object with measuremtns -> rectangle
        const rect = cloud.getBoundingClientRect();
        // rect.left -> distance from screen's left edge to cloud's left edge (px)
        offsetX = event.clientX - rect.left;
        // rect.top -> distance from screen's top edge to cloud's top edge (px)
        offsetY = event.clientY - rect.top;
      });
    }

    // when the mouse is moving measured values for X and Y ensure that mouse stays where I started to grap
    document.addEventListener("mousemove", (event) => {
      if (!isDragging) return;
      // that spot where I klicked
      activeCloud.style.left = (event.clientX - offsetX) + "px";
      activeCloud.style.top = (event.clientY - offsetY) + "px";
    })


    const cloudDropZone = document.getElementById("cloud-drop-zone");
    const zoneRect = cloudDropZone.getBoundingClientRect();
    // when I'm not holding that one klick anymore, then release the cloud
    document.addEventListener("mouseup", (event) => {
      isDragging = false;

      let mouseIsInZone =
        // is the mouse inside the box?
        event.clientX > zoneRect.left &&
        event.clientX < zoneRect.right &&
        event.clientY > zoneRect.top &&
        event.clientY < zoneRect.bottom

      if (mouseIsInZone) {
        ;
        if (cloudInZone) {
          return;
        }
        cloudInZone = activeCloud
        activeCloud.classList.add("active-cloud");
        const activeCloudRect = activeCloud.getBoundingClientRect();
        // centering
        activeCloud.style.left = "50%";
        activeCloud.style.top = "50%";
        activeCloud.style.transform = "translate(-50%, -50%)";
      }
    })
  }
}

// Creation
function createFloatingClouds(input, container) {
  // Container for all Clouds
  const divClouds = document.createElement("div");
  divClouds.classList.add("thought-cloud");

  // Cloud image create
  const imgCloud = document.createElement("img");
  imgCloud.src = "assets/images/ai-generated/thought.png";

  // Text create
  const thoughtTextCloud = document.createElement("span");
  thoughtTextCloud.classList.add("thought-text-cloud");
  // .value is the String I gave -> .textContent is showing the text
  thoughtTextCloud.textContent = input;

  // put created img, text into Container
  divClouds.appendChild(imgCloud);
  divClouds.appendChild(thoughtTextCloud);
  container.appendChild(divClouds);
  // give that value for the drag and drop catch later!
  return divClouds;
}

function emotionsCreation() {
  const emotionsContainer = document.getElementById("emotions-container");
  if (emotionsContainer) {

    for (let emotionCounter = 0; emotionCounter < emotionsAmount; emotionCounter++) {
      const emotion = document.createElement("div");
      emotion.classList.add("emotion");

      emotionsContainer.appendChild(emotion);
    }
  }
}


//order matters inside a function, not between functions.
function init() {
  // Navigation
  IndexNavigation();
  readyToEmotionsNavigation();

  // Page feature
  featureThoughts();
  thoughtsRecreateOnDocEmotions();

  emotionsCreation();

  // Visual effects
  appearingInputText();
}

// only run init when HTML is fullry parsed!  //defer -> also wait's until HTML is parsed -> covers globals  //without defer, globals -> null
// defer makes the whole script wait for DOM! -> dealy -> saves globals form grabbing -> null
document.addEventListener("DOMContentLoaded", init);

