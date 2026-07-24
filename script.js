// ----------------------------------- GLOBALS ----------------------------------- //
const screenEmotions = document.querySelector(".screen-3-emotions");
const screenAnalyze = document.querySelector(".screen-4-analyze");

const cloudDropZone = document.getElementById("cloud-drop-zone");

const emotionsContainer = document.getElementById("emotions-container");
const thoughtsPanel = document.getElementById("thoughts-panel");

let saveButtonOn = false;

const thoughtReleaseOrSave = document.getElementById("thought-release-or-save");

let thoughtsAndEmotions = [];
let savedThoughtsAndEmotions = [];
const consumedEmotionArray = [];

const thoughtInput = document.getElementById("thought-input-box");

const MAX_THOUGHTS = 8;

const readyButton = document.getElementById("ready-button");


// Amount of useable emotions
const EMOTIONS = ["Happy", "Lonely", "Calm", "Ashamed", "Proud", "Anxious", "Hopeful", "Angry", "Loved", "Sad", "Excited", "Guilty"]

// position on specific box
let offsetX = 0;
let offsetY = 0;
let offsetXEmotionsContainer = 0;
let offsetYEmotionsContainer = 0;
let offsetXThoughtsPanel = 0;
let offsetYThoughtsPanel = 0;

// Default state
let activeObject = null;
let cloudInZone = null;
let isDragging = false;


// ----------------------------------- FUNCTIONS ----------------------------------- //
// ===== Naviagtions ===== //
function menuNavigation() {
  const homeButton = document.getElementById("home-button");
  if (homeButton) {
    homeButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  const homeColoredButton = document.querySelector(".home-colored-button");
  if (homeColoredButton) {
    homeColoredButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  const thoughtsButton = document.getElementById("thoughts-button");
  if (thoughtsButton) {
    thoughtsButton.addEventListener("click", () => {
      window.location.href = "thoughts.html";
    });
  }

  const emotionsButton = document.getElementById("emotions-button");
  if (emotionsButton) {
    emotionsButton.addEventListener("click", () => {
      window.location.href = "emotions.html";
    })
  }

  const analyzeButton = document.getElementById("analyze-button");
  if (analyzeButton) {
    analyzeButton.addEventListener("click", () => {
      window.location.href = "analyze.html";
    })
  }
}

function readyToEmotionsNavigation() {
  // Take Clouds onto next screen 
  if (readyButton) {
    readyButton.addEventListener("click", () => {
      window.location.href = "emotions.html";
    })
  }
}

// ===== Page feature ===== //
function featureThoughts() {
  let sparkleEffectSwitch = true;

  const thoughtsContainer = document.getElementById("thoughts-container");
  const thoughtCounter = document.getElementById("thought-counter");


  if (thoughtInput) {

    let savedThoughtsJson = localStorage.getItem("thoughtsAndEmotions")
    thoughtsAndEmotions = JSON.parse(savedThoughtsJson) || [];

    let inputCounter = thoughtsAndEmotions.length
    thoughtCounter.textContent = inputCounter.toString() + "/" + MAX_THOUGHTS.toString();

    function readyAndSparkle() {
      if (inputCounter > 0 && sparkleEffectSwitch) {
        const sparkleVisual = document.getElementById("sparkle-effect");
        readyButton.style.visibility = "visible";
        sparkleEffect(sparkleVisual);
        sparkleEffectSwitch = false;
      }
    }

    readyAndSparkle();
    counterAppearing(thoughtCounter, inputCounter);

    for (let cloudNumber = 0; cloudNumber < inputCounter; cloudNumber++) {
      createFloatingClouds(thoughtsAndEmotions[cloudNumber].thought, thoughtsContainer);
    }
    // Press Enter -> thought counter + 1, create cloud
    thoughtInput.addEventListener("keydown", (event) => {
      const cleanValue = thoughtInput.value.trim();
      if (event.key === "Enter" && cleanValue !== "" && inputCounter < MAX_THOUGHTS) {

        inputCounter++;
        counterAppearing(thoughtCounter, inputCounter);
        createFloatingClouds(cleanValue, thoughtsContainer);

        thoughtsAndEmotions.push({ thought: cleanValue, emotions: [] });
        localStorage.setItem("thoughtsAndEmotions", JSON.stringify(thoughtsAndEmotions));

        // clearing the text-field
        thoughtInput.value = "";
      }
      readyAndSparkle();
    });
  }
}
function thoughtsRecreateOnDocEmotions() {
  // Start position -> clouds
  const topSpacingCloud = 0;
  const rightSpacingCloud = 15;
  const gapBetweenCloud = 25;

  if (thoughtsPanel) {
    let thoughtsJson = localStorage.getItem("thoughtsAndEmotions");

    thoughtsAndEmotions = JSON.parse(thoughtsJson) || [];



    function resetZone(cloudWasSaved) {
      if (!cloudWasSaved) {
        cloudInZone.style.top = cloudInZone.dataset.positionTop;
        cloudInZone.style.right = cloudInZone.dataset.positionRight;
        cloudInZone.style.left = "";

        cloudInZone.classList.remove("active-cloud");
        cloudInZone.classList.remove("shiny")
        cloudInZone.classList.add("float-cloud");
      }

      cloudInZone.style.transform = "";
      cloudDropZone.style.visibility = "";
      thoughtReleaseOrSave.style.visibility = "";
      cloudInZone = null;

      thoughtReleaseOrSave.textContent = "Release";
    }

    if (thoughtReleaseOrSave) {
      thoughtReleaseOrSave.addEventListener("click", () => {
        const emotionBoxes = document.querySelectorAll(".emotion-box");
        if (saveButtonOn) {
          saveButtonOn = false;

          thoughtReleaseOrSave.classList.add("consumed");

          const saveCloud = cloudInZone
          saveCloud.classList.add("consumed");
          saveCloud.classList.remove("shiny");
          let savedThoughtsJson = localStorage.getItem("savedThoughtsAndEmotions")
          savedThoughtsAndEmotions = JSON.parse(savedThoughtsJson) || [];

          const thoughtToSave = thoughtsAndEmotions[saveCloud.dataset.thoughtNumber]
          savedThoughtsAndEmotions.push(thoughtToSave)
          localStorage.setItem("savedThoughtsAndEmotions", JSON.stringify(savedThoughtsAndEmotions));

          thoughtsAndEmotions.splice(saveCloud.dataset.thoughtNumber, 1);
          localStorage.setItem("thoughtsAndEmotions", JSON.stringify(thoughtsAndEmotions));

          saveCloud.addEventListener("animationend", (event) => {
            if (event.animationName !== "consumed") return;
            saveCloud.remove();

            const remainingThoughts = document.querySelectorAll(".thought-cloud")
            for (let thoughtsNumber = 0; thoughtsNumber < remainingThoughts.length; thoughtsNumber++) {
              remainingThoughts[thoughtsNumber].dataset.thoughtNumber = thoughtsNumber;
              positionObject(thoughtsNumber, remainingThoughts[thoughtsNumber], topSpacingCloud, rightSpacingCloud, gapBetweenCloud);
            }
            if (remainingThoughts.length > 3) {
              remainingThoughts[3].style.visibility = "visible";
            }
            resetZone(true);
            thoughtReleaseOrSave.classList.remove("consumed");
          })
        } else {
          resetZone(false);
        }
        emotionRebuild(emotionBoxes, "hidden");
      })
    }

    for (let thoughtCounter = 0; thoughtCounter < thoughtsAndEmotions.length; thoughtCounter++) {

      const cloud = createFloatingClouds(thoughtsAndEmotions[thoughtCounter].thought, thoughtsPanel);
      cloud.dataset.thoughtNumber = thoughtCounter

      if (thoughtCounter > 3) {
        cloud.style.visibility = "hidden";
      }

    positionObject(thoughtCounter, cloud, topSpacingCloud, rightSpacingCloud, gapBetweenCloud);


      pressObject("mousedown", cloud);
      pressObject("touchstart", cloud);
    }
    moveObject("mousemove");
    moveObject("touchmove");

    dropObjectCloud("mouseup", cloudDropZone, thoughtReleaseOrSave, "active-cloud");
    dropObjectCloud("touchend", cloudDropZone, thoughtReleaseOrSave, "active-cloud");
  }
}

// ===== Creation ===== //
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


  let inputLength = input.replace(/ +/g, " ").length;

  const startSize = 2.75;
  const shrinkFactor = 0.15;
  let cloudFontSize = Math.max(1, startSize - (Math.sqrt(inputLength) * shrinkFactor));


  thoughtTextCloud.style.fontSize = cloudFontSize + "vw";

  // put created img, text into Container
  divClouds.appendChild(imgCloud);
  divClouds.appendChild(thoughtTextCloud);
  container.appendChild(divClouds);

  divClouds.classList.add("float-cloud");
  // give that value for the drag and drop catch later!
  return divClouds;
}
function createEmotions() {

  // Set start position
  let rightSpacingEmotion = 75;
  const topSpacingEmotion = 5;
  const gapBetweenEmotion = 15;

  if (emotionsContainer) {
    let positionInRow;
    const emotionsAmount = EMOTIONS.length;

    for (let emotionCounter = 0; emotionCounter < emotionsAmount; emotionCounter++) {

      const emotionBox = document.createElement("div");
      emotionBox.classList.add("emotion-box");

      const emotionText = document.createElement("span");
      emotionText.classList.add("emotion-text");
      emotionText.textContent = EMOTIONS[emotionCounter];

      emotionBox.appendChild(emotionText);
      emotionsContainer.appendChild(emotionBox);

      emotionBox.classList.add("pulse");

      if (emotionCounter < emotionsAmount / 2) {
        positionInRow = emotionCounter;
      } else {
        rightSpacingEmotion = 50;
        positionInRow = emotionCounter - (emotionsAmount / 2);
      }

      positionObject(positionInRow, emotionBox, topSpacingEmotion, rightSpacingEmotion, gapBetweenEmotion)

      pressObject("mousedown", emotionBox);
      pressObject("touchstart", emotionBox);
    }
    moveObject("mousemove");
    moveObject("touchmove");

    dropObjectEmotion("mouseup");
    dropObjectEmotion("touchend");
  }
}
function pieChart() {
  if (screenAnalyze) {
    const emotionTally = {};

    let savedThoughtsJson = localStorage.getItem("savedThoughtsAndEmotions")
    savedThoughtsAndEmotions = JSON.parse(savedThoughtsJson) || [];

    for (let entrieEmotionsNumber = 0; entrieEmotionsNumber < savedThoughtsAndEmotions.length; entrieEmotionsNumber++) {
      const currentEmotions = savedThoughtsAndEmotions[entrieEmotionsNumber].emotions

      for (let emotionNumber = 0; emotionNumber < currentEmotions.length; emotionNumber++) {
        const thatEmotion = currentEmotions[emotionNumber]
        if (!emotionTally[thatEmotion]) {
          emotionTally[thatEmotion] = 1;
        } else {
          emotionTally[thatEmotion] += 1;
        }
      }
    }

    const labels = Object.keys(emotionTally);
    const numbers = Object.values(emotionTally);
    const pieChartElement = document.getElementById("pie-chart");

    const pieConfig = {
      type: "pie",
      data: {
        labels: labels,
        datasets: [{ data: numbers }]
      }
    }

    new Chart(pieChartElement, pieConfig)
  }
}


// ===== Position Objects ===== //
function positionObject(counterObject, rawObject, topSpacing, rightSpacing, gapBetween) {

  const gapHeight = gapBetween * counterObject;

  // dataset = home position, drag-and-drop reset snaps back to it
  rawObject.dataset.positionTop = topSpacing + gapHeight + "%";
  rawObject.style.top = rawObject.dataset.positionTop;

  rawObject.dataset.positionRight = rightSpacing + "%";
  rawObject.style.right = rawObject.dataset.positionRight;
}
function emotionRebuild(emotionBoxes, visibility) {

  for (let emotionNumber = 0; emotionNumber < emotionBoxes.length; emotionNumber++) {
    emotionBoxes[emotionNumber].style.visibility = visibility
    emotionBoxes[emotionNumber].style.animation = "";
    emotionBoxes[emotionNumber].classList.remove("consumed");

    emotionBoxes[emotionNumber].classList.remove("pulse");
    emotionBoxes[emotionNumber].getBoundingClientRect();
    emotionBoxes[emotionNumber].classList.add("pulse");

    emotionBoxes[emotionNumber].style.top = emotionBoxes[emotionNumber].dataset.positionTop;
    emotionBoxes[emotionNumber].style.right = emotionBoxes[emotionNumber].dataset.positionRight;
    emotionBoxes[emotionNumber].style.left = "";
  }
}

// ===== Dragging Objects ===== //
function pressObject(on, rawObject) {
  rawObject.addEventListener(on, (event) => {
    activeObject = rawObject;
    isDragging = true;

    activeObject.style.cursor = "grabbing";

    // disable "can't drop here-Symbol" for dragging
    event.preventDefault();

    // Every press changes position -> new dimensions needed
    const rectObject = rawObject.getBoundingClientRect();
    const rectEmotionsContainer = emotionsContainer.getBoundingClientRect();
    const rectThoughtsPanel = thoughtsPanel.getBoundingClientRect();

    const pointX = event.touches ? event.touches[0].clientX : event.clientX;
    const pointY = event.touches ? event.touches[0].clientY : event.clientY;

    offsetX = pointX - rectObject.left;
    offsetY = pointY - rectObject.top;

    offsetXEmotionsContainer = rectEmotionsContainer.left;
    offsetYEmotionsContainer = rectEmotionsContainer.top;

    offsetXThoughtsPanel = rectThoughtsPanel.left;
    offsetYThoughtsPanel = rectThoughtsPanel.top;
  });
}
function moveObject(move) {
  // keep grab point under cursor while dragging
  document.addEventListener(move, (event) => {
    if (!isDragging) return;

    const pointX = event.touches ? event.touches[0].clientX : event.clientX;
    const pointY = event.touches ? event.touches[0].clientY : event.clientY;

    if (activeObject.classList.contains("emotion-box")) {
      const rectEmotionsContainer = emotionsContainer.getBoundingClientRect();
      activeObject.style.left = ((pointX - offsetX - offsetXEmotionsContainer) / rectEmotionsContainer.width) * 100 + "%";
      activeObject.style.top = ((pointY - offsetY - offsetYEmotionsContainer) / rectEmotionsContainer.height) * 100 + "%";
    } else {
      const rectThoughtsPanel = thoughtsPanel.getBoundingClientRect();
      activeObject.style.left = ((pointX - offsetX - offsetXThoughtsPanel) / rectThoughtsPanel.width) * 100 + "%";
      activeObject.style.top = ((pointY - offsetY - offsetYThoughtsPanel) / rectThoughtsPanel.height) * 100 + "%";
    }

    // reset style right -> only one "anchor"
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

        const rectCloudDropZone = cloudDropZone.getBoundingClientRect();
        const centerX = rectCloudDropZone.left + (rectCloudDropZone.width / 2);
        const centerY = rectCloudDropZone.top + (rectCloudDropZone.height / 2);

        
        // centering
        activeObject.classList.remove("float-cloud")

        const rectThoughtsPanel = thoughtsPanel.getBoundingClientRect();
        activeObject.style.left = ((centerX - rectThoughtsPanel.left) / rectThoughtsPanel.width) * 100 + "%";
        activeObject.style.top =  ((centerY - rectThoughtsPanel.top) / rectThoughtsPanel.height) * 100 + "%";
        activeObject.style.transform = "translate(-50%, -50%)";

        const emotionBoxes = document.querySelectorAll(".emotion-box");

        // emotions exist -> reset to default state
        if (emotionBoxes.length > 0) {
          emotionRebuild(emotionBoxes, "visible")
        } else {
          // first visit -> create emotions
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

// ===== Visual effects ===== //
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
  if (inputCounter === MAX_THOUGHTS) {
    thoughtCounter.style.filter = "brightness(1.3)";
    thoughtCounter.classList.add("wobble");
  }
}
function consumeEmotion() {
  const cloudReadyToEat = cloudInZone
  const eatEmotion = activeObject;
  const emotionTextCollect = eatEmotion.textContent

  eatEmotion.classList.remove("pulse")
  eatEmotion.classList.add("consumed")

  const currentThoughtEmotions = thoughtsAndEmotions[cloudReadyToEat.dataset.thoughtNumber].emotions

  if (cloudReadyToEat) {
    cloudReadyToEat.classList.remove("shiny");
    cloudReadyToEat.getBoundingClientRect();   // force reflow
    cloudReadyToEat.classList.add("shiny");

    currentThoughtEmotions.push(emotionTextCollect);
    localStorage.setItem("thoughtsAndEmotions", JSON.stringify(thoughtsAndEmotions));
  }

  eatEmotion.addEventListener("animationend", () => {
    eatEmotion.style.visibility = "hidden";
    consumedEmotionArray.push(emotionTextCollect);
  }, { once: true });

  if (currentThoughtEmotions.length >= 1) {
    thoughtReleaseOrSave.textContent = "Save";
    saveButtonOn = true;
  }
}

// ----------------------------------- INITIALIZE ----------------------------------- //
function init() {
  // Navigation
  menuNavigation();
  readyToEmotionsNavigation();

  // Page feature
  featureThoughts();
  thoughtsRecreateOnDocEmotions();
  pieChart();

  // Visual effects
  appearingInputText();
}

document.addEventListener("DOMContentLoaded", init)