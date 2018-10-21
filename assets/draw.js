var canvas = document.getElementById("draw");
var img = document.getElementById("img");
var ans = document.getElementById("answer");
var ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.strokeStyle = "white";
  ctx.lineWidth = 15;
  ctx.lineJoin = ctx.lineCap = 'round';
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}
resize()

////////////////////////////////////////////////////////////////////////////////
// source: http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html
// Set up mouse events for drawing
var drawing = false;
var mousePos = { x:0, y:0 };
var lastPos = mousePos;
canvas.addEventListener("mousedown", function (e) {
  drawing = true;
  lastPos = getMousePos(canvas, e);
}, false);
canvas.addEventListener("mouseup", function (e) {
  drawing = false;
}, false);
canvas.addEventListener("mousemove", function (e) {
  mousePos = getMousePos(canvas, e);
}, false);

// Get the position of the mouse relative to the canvas
function getMousePos(canvasDom, mouseEvent) {
  return {
    x: mouseEvent.clientX,
    y: mouseEvent.clientY
  };
}

// Get a regular interval for drawing to the screen
window.requestAnimFrame = (function (callback) {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimaitonFrame ||
    function (callback) {
      window.setTimeout(callback, 1000/600);
    };
})();

// Draw to the canvas
function renderCanvas() {
  if (drawing) {
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();
    lastPos = mousePos;
  }
}

// Allow for animation
(function drawLoop () {
  requestAnimFrame(drawLoop);
  renderCanvas();
})();

// Set up touch events for mobile, etc
canvas.addEventListener("touchstart", function (e) {
  mousePos = getTouchPos(canvas, e);
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchend", function (e) {
  var mouseEvent = new MouseEvent("mouseup", {});
  canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchmove", function (e) {
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, false);

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}

// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchend", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchmove", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
////////////////////////////////////////////////////////////////////////////////

function clearCanvas() {
  resize()
}

function setLineWidth(value) {
  ctx.lineWidth = value;
}

function submitCanvas() {
  ans.innerHTML = "";

  var canvasData = canvas.toDataURL("image/png").replace("data:image/png;base64,", "");
  if (window.XMLHttpRequest) {
    ajax = new XMLHttpRequest();
  }
  else if (window.ActiveXObject) {
    ajax = new ActiveXObject("Microsoft.XMLHTTP");
  }

  ajax.open("POST", "cgi-bin/submit.py");
  ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  ajax.onreadystatechange = function() {
    ans.innerHTML = ajax.responseText;
    setTimeout(function() { ans.innerHTML = ""; }, 1000);
  }
  ajax.send("name=27171&img=" + canvasData);
}
