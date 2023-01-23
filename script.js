// init called only for https://www.youtube.com/* pages
function init() {
  // loop for long loading
  setTimeout(() => {
    // search for 'video' element
    if (containsVideoElement()) {
      addImplementation();
    } else {
      init();
    }
  }, 500);
}

function containsVideoElement() {
  return document.querySelector("video") !== null;
}

function addImplementation() {
  const loopButton = createLoopButton();
  // console.log("loop button", loopButton);
  insertLoopButton(loopButton);
  observeVideo();
}

// create loop button
function getLoopButtonSVG() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"
  );
  svg.appendChild(path);
  return svg;
}

function createLoopButton() {
  //   const control = document.querySelectorAll(".ytp-chrome-controls")[0];
  const control = document.querySelectorAll(".ytp-left-controls")[0];
  var loopButton = document.createElement("a");
  loopButton.className = "ytp-button loop-button";
  // loopButton.title = "Loop video";
  loopButton.setAttribute("data-title", "Loop video");
  loopButton.setAttribute("role", "button");

  const svg = getLoopButtonSVG();
  loopButton.appendChild(svg);

  tooltip = createTooltip(loopButton);

  loopButton.addEventListener("click", toggleLoop);
  return loopButton;
}

function toggleLoop() {
  // toggle loop
  const video = document.querySelector("video");
  var loop = !video.loop;
  video.loop = loop;
  if (loop) video.play();

  // update loop button states
  updateLoopButtonStates();
}

function createTooltip(loopButton) {
  var tooltip = document.createElement("div");
  tooltip.setAttribute("id","yt-video-loop-tooltip");
  tooltip.className = "ytp-tooltip  ytp-bottom";
  tooltip.style.display = "none";

  var wrapper = document.createElement("div");
  wrapper.className = "ytp-tooltip-text-wrapper";

  var tooltipText = document.createElement("span");
  tooltipText.className = "ytp-tooltip-text";

  var position = document.getElementsByClassName("ytp-storyboard")[0];
  wrapper.appendChild(tooltipText);
  tooltip.appendChild(wrapper);
  document.getElementById("movie_player").insertBefore(tooltip, position);

  loopButton.addEventListener("mouseover", showTooltip);
  loopButton.addEventListener("mouseleave", hideTooltip);

  function showTooltip() {
    var videoHeight = parseInt(
      document.getElementsByClassName("video-stream html5-main-video")[0].style
        .height,
      10
    );

    tooltipText.innerHTML = loopButton.getAttribute("data-title");
    tooltip.style.left = loopButton.offsetLeft + "px";
    tooltip.style.top = videoHeight - 87.5 + "px";
    tooltip.style.display = "inline";
  }

  function hideTooltip() {
    tooltip.style.display = "none";
  }
}

function updateLoopButtonStates() {
  const loopButton = document.querySelector(".loop-button");
  loopButton.classList.toggle("active");
  const active = isActive();
  loopButton.setAttribute("data-title", active ? "Stop looping" : "Loop video");

  const tooltipText = document.querySelector("#yt-video-loop-tooltip .ytp-tooltip-text");
  tooltipText.innerHTML = loopButton.getAttribute("data-title");
}

// insert loop button
function insertLoopButton(loopButton) {
  const control = document.querySelectorAll(".ytp-right-controls")[0];
  //control.appendChild(loopButton);
  control.insertBefore(loopButton, control.children[0]);
}

function isActive() {
  const loopButton = document.querySelector(".loop-button");
  return loopButton.classList.contains("active");
}

function requireUpdateLoopButtonStates(loop) {
  const active = isActive();
  return (loop === null && active) || (loop !== null && !active);
}

function observeVideo() {
  const video = document.querySelector("video");
  var observer = new MutationObserver(function (mutations) {
    // require update controls ?
    mutations.forEach(() => {
      if (requireUpdateLoopButtonStates(video.getAttribute("loop")))
        updateLoopButtonStates();
    });
  });
  // observe loop changes
  observer.observe(video, { attributes: true, attributeFilter: ["loop"] });
}

init();
