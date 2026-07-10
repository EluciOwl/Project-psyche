// Thoughts from input field
const thoughtInput = document.getElementById("thought-input-box");
// readyButton that appears after 4 entered thoughts
const readyButton = document.getElementById("ready-button");

const screenEmotions = document.querySelector(".screen-3-emotions");

// collecting thoughts via input
let thoughtsArray = [];

const MAX_THOUGHTS = 4;

// vh and vw
let vh = window.innerHeight * 0.01;
let vw = window.innerWidth * 0.01;

// Position of the recreated Clouds on emotions.html
let topSpacingCloud = 20;
let rightSpacingCloud = 10;
let gapBetweenCloud = 20;
// gap between the recreated Clouds

// emotions start positions
let topSpacingEmotion = -45;
let rightSpacingEmotion = 180;
let gapBetweenEmotion = 8.5;

let gapHeight = 0;
let positionTop = 0;
let positionRight = 0;

let emotionsAmount = 10;
const EMOTIONS = ["Happy", "Calm", "Proud", "Hopeful", "Loved", "Sad", "Angry", "Anxious", "Ashamed", "Lonely"]

// Dragging Object variables
let isDragging = false;
let activeObject = null;
let offsetX = 0;
let offsetY = 0;
let cloudInZone = null;

const consumedEmotionArray = [];
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


// Dragging Objects
function pressObject(on, rawObject) {
  rawObject.addEventListener(on, (event) => {


    activeObject = rawObject;
    isDragging = true;

    activeObject.style.cursor = "grabbing";

    // No 🚫 "can't drop here-Symbol" is appearing!
    event.preventDefault();

    // hands back an object with measuremtns -> rectangle
    const rect = rawObject.getBoundingClientRect();

    if (event.touches) {
      offsetX = event.touches[0].clientX - rect.left;
      offsetY = event.touches[0].clientY - rect.top;

    } else {
      // rect.left -> distance from screen's left edge to cloud's left edge (px)
      offsetX = event.clientX - rect.left;
      // rect.top -> distance from screen's top edge to cloud's top edge (px)
      offsetY = event.clientY - rect.top;
    }
  });
}
function moveObject(move) {

  // when the mouse is moving measured values for X and Y ensure that mouse stays where I started to grap
  document.addEventListener(move, (event) => {
    if (!isDragging) return;
    // that spot where I klicked
    if (event.touches) {
      activeObject.style.left = (event.touches[0].clientX - offsetX) + "px";
      activeObject.style.top = (event.touches[0].clientY - offsetY) + "px";
    } else {
      activeObject.style.left = (event.clientX - offsetX) + "px";
      activeObject.style.top = (event.clientY - offsetY) + "px";

    }
    // Object stretches to the left when dragging to the left when that is not cleared haha
    // reset css settings AND Browser doesn't paint mid-function all at once when even expect of getBoundingClientRect
    activeObject.style.right = "";
  })
}
function dropObjectCloud(offCloud, dropZone, releaseButton, activeClass) {
  // when I'm not holding that one klick anymore, then release the cloud
  document.addEventListener(offCloud, (event) => {

    // it's like vaidating a valid ticket
    // When no Cloud -> return
    if (!isDragging || !activeObject.classList.contains("thought-cloud")) return;

    isDragging = false;
    activeObject.style.cursor = "grab";

    // guard because emotions without zone! --> fixing that later hihi
    if (!dropZone) return;

    function invadeZoneCloud(indicatorIsInZone) {
      if (indicatorIsInZone) {
        if (cloudInZone) {
          activeObject.style.top = activeObject.dataset.positionTop;
          activeObject.style.right = activeObject.dataset.positionRight;
          activeObject.style.left = "";
          return;
        }
        if (releaseButton) {
          releaseButton.style.visibility = "visible";
        }
        dropZone.style.visibility = "hidden";

        cloudInZone = activeObject
        activeObject.classList.add(activeClass);

        // centering
        activeObject.style.left = "50%";
        activeObject.style.top = "50%";
        activeObject.style.transform = "translate(-50%, -50%)";

        const emotionBoxes = document.querySelectorAll(".emotion-box");

        if (emotionBoxes.length > 0) {
          for (let emotionNumber = 0; emotionNumber < emotionBoxes.length; emotionNumber++) {
            emotionBoxes[emotionNumber].style.visibility = "visible"
            emotionBoxes[emotionNumber].style.animation = "";
            emotionBoxes[emotionNumber].classList.remove("consumed");

            emotionBoxes[emotionNumber].classList.remove("pulse");
            emotionBoxes[emotionNumber].getBoundingClientRect();
            emotionBoxes[emotionNumber].classList.add("pulse");

            emotionBoxes[emotionNumber].style.top = emotionBoxes[emotionNumber].dataset.positionTop;
            emotionBoxes[emotionNumber].style.right = emotionBoxes[emotionNumber].dataset.positionRight;
            emotionBoxes[emotionNumber].style.left = "";
          }
        } else {
          createEmotions();
        }
      }
    }

    const zoneRect = dropZone.getBoundingClientRect();
    if (event.touches) {
      let fingerIsInZone =
        // touches doesn't work, because finger is already lifted -> undef. Use changedTouches meowww
        event.changedTouches[0].clientX > zoneRect.left &&
        event.changedTouches[0].clientX < zoneRect.right &&
        event.changedTouches[0].clientY > zoneRect.top &&
        event.changedTouches[0].clientY < zoneRect.bottom

      invadeZoneCloud(fingerIsInZone);
    } else {
      let mouseIsInZone =
        // is the mouse inside the box?
        // Start top-left corner (0,0) -> Screens draw pixels starting from top-left!!!
        event.clientX > zoneRect.left &&
        event.clientX < zoneRect.right &&
        event.clientY > zoneRect.top &&
        event.clientY < zoneRect.bottom

      invadeZoneCloud(mouseIsInZone);
    }
  })
}
function dropObjectEmotion(offEmotion) {
  document.addEventListener(offEmotion, (event) => {

    if (!isDragging || !activeObject.classList.contains("emotion-box")) return;
    isDragging = false;

    activeObject.style.cursor = "grab"

    if (cloudInZone) {
      const zoneRect = document.getElementById("cloud-drop-zone").getBoundingClientRect();

      if (event.touches) {
        let fingerIsInZone =
          event.changedTouches[0].clientX > zoneRect.left &&
          event.changedTouches[0].clientX < zoneRect.right &&
          event.changedTouches[0].clientY > zoneRect.top &&
          event.changedTouches[0].clientY < zoneRect.bottom

        if (fingerIsInZone) consumeEmotion();
      } else {
        let mouseIsInZone =
          event.clientX > zoneRect.left &&
          event.clientX < zoneRect.right &&
          event.clientY > zoneRect.top &&
          event.clientY < zoneRect.bottom

        if (mouseIsInZone) consumeEmotion();
      }
    }
  })
}



// position Objects
function positionObject(rawObject, topSpacing, rightSpacing, gapBetween) {
  // Start position of recreated Clouds at the right of the screen
  rawObject.dataset.positionTop = topSpacing + gapHeight + "vh";
  rawObject.style.top = rawObject.dataset.positionTop;

  rawObject.dataset.positionRight = rightSpacing + "vh";
  rawObject.style.right = rawObject.dataset.positionRight;

  gapHeight += gapBetween;
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
  if (screenEmotions) {
    let thoughtsJson = localStorage.getItem("thoughts");
    // || [] protects .length from crashing if parse gave nothing!
    thoughtsArray = JSON.parse(thoughtsJson) || [];

    const thoughtRelease = document.getElementById("thought-release");
    const cloudDropZone = document.getElementById("cloud-drop-zone");

    if (thoughtRelease) {
      thoughtRelease.addEventListener("click", () => {
        cloudInZone.style.top = cloudInZone.dataset.positionTop;
        cloudInZone.style.right = cloudInZone.dataset.positionRight;
        cloudInZone.style.left = "";
        cloudInZone.classList.remove("active-cloud");
        cloudDropZone.style.visibility = "";
        thoughtRelease.style.visibility = "";
        cloudInZone = null;
      })
    }

    for (let thoughtsNumber = 0; thoughtsNumber < thoughtsArray.length; thoughtsNumber++) {
      // Store created cloud
      const cloud = createFloatingClouds(thoughtsArray[thoughtsNumber], screenEmotions);

      positionObject(cloud, topSpacingCloud, rightSpacingCloud, gapBetweenCloud);

      pressObject("mousedown", cloud);
      pressObject("touchstart", cloud);

    }
    moveObject("mousemove");
    moveObject("touchmove");

    dropObjectCloud("mouseup", cloudDropZone, thoughtRelease, "active-cloud");
    dropObjectCloud("touchend", cloudDropZone, thoughtRelease, "active-cloud");
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

function createEmotions() {
  let offsetEmotionX = 0;
  let offsetEmotionY = 0;

  if (screenEmotions) {
    let lineBreak = 0;

    for (let emotionCounter = 0; emotionCounter < emotionsAmount; emotionCounter++) {

      const emotionBox = document.createElement("div");
      emotionBox.classList.add("emotion-box");

      const emotionText = document.createElement("span")
      emotionText.classList.add("emotion-text");
      emotionText.textContent = EMOTIONS[emotionCounter];

      emotionBox.appendChild(emotionText);
      screenEmotions.appendChild(emotionBox);

      emotionBox.classList.add("pulse");

      lineBreak = lineBreak + 1;

      if (lineBreak === 6) {
        rightSpacingEmotion = 160;
        topSpacingEmotion = -87.5;
      }
      positionObject(emotionBox, topSpacingEmotion, rightSpacingEmotion, gapBetweenEmotion)
      pressObject("mousedown", emotionBox);
      pressObject("touchstart", emotionBox);
    }
    moveObject("mousemove");
    moveObject("touchmove");

    dropObjectEmotion("mouseup");
    dropObjectEmotion("touchend");
  }
}
function consumeEmotion() {
  const eatEmotion = activeObject;

  eatEmotion.classList.remove("pulse")

  eatEmotion.classList.add("consumed")

  const emotionTextCollect = eatEmotion.textContent

  eatEmotion.addEventListener("animationend", () => {
    eatEmotion.style.visibility = "hidden";
    consumedEmotionArray.push(emotionTextCollect);
    console.log(consumedEmotionArray);
  })
}

//order matters inside a function, not between functions.
function init() {
  // Navigation
  IndexNavigation();
  readyToEmotionsNavigation();

  // Page feature
  featureThoughts();
  thoughtsRecreateOnDocEmotions();

  // Visual effects
  appearingInputText();
}

// only run init when HTML is fullry parsed!  //defer -> also wait's until HTML is parsed -> covers globals  //without defer, globals -> null
// defer makes the whole script wait for DOM! -> dealy -> saves globals form grabbing -> null
document.addEventListener("DOMContentLoaded", init);

