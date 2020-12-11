//Variables
const canvas = document.getElementById("draw_canvas");
const context = canvas.getContext("2d");
const clearCanvasButton = document.getElementById("clear_canvas");
const downloadImageButton = document.getElementById("download_canvas_image");
const shapeBox = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};
const startedPoint = {
  x: 0,
  y: 0,
};
let selectedTool = "pencil";
let savedImage;
let isPainting = false;

//Event listeners
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mousemove", paint);
canvas.addEventListener("mouseup", stopPainting);

clearCanvasButton.addEventListener("click", clearCanvas);
downloadImageButton.addEventListener("click", downloadImage);

//Framing the canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Functions
function startPainting(event) {
  saveCanvasImages();
  const location = getMousePosition(event);
  startedPoint.x = location.x;
  startedPoint.y = location.y;
  isPainting = true;
  if (selectedTool == "pencil") {
    paint(event);
  }
}

function stopPainting(event) {
  updateShapeBox(event);
  isPainting = false;
  if (selectedTool == "pencil" || selectedTool == "line" || selectedTool == "circle") {
    context.beginPath();
  } else if (selectedTool == "square") {
    paint(event);
  }
}

function paint(event) {
  if (!isPainting) {
    return;
  }
  redrawCanvasImage();
  updateShapeBox(event);
  const paintingColor = document.getElementById("painting_color").value;
  const lineWidth = document.getElementById("line_width").value;
  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.strokeStyle = paintingColor;
  switch (selectedTool) {
    case "pencil":
      context.lineTo(event.clientX, event.clientY);
      context.stroke();
      break;
    case "line":
      const location = getMousePosition(event);
      context.beginPath();
      context.moveTo(startedPoint.x, startedPoint.y);
      context.lineTo(location.x, location.y);
      context.stroke();
      break;
    case "square":
      context.strokeRect(shapeBox.x, shapeBox.y, shapeBox.width, shapeBox.height);
      break;
    case "circle":
      const radius = shapeBox.width;
      context.beginPath();
      context.arc(startedPoint.x, startedPoint.y, radius, 0, Math.PI * 2);
      context.stroke();
      break;
    default:
      break;
  }
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function downloadImage(event) {
  const downloadButton = event.target;
  downloadButton.setAttribute("download", "image.jpeg");
  downloadButton.setAttribute("href", canvas.toDataURL());
}

function updateShapeBox(event) {
  const location = getMousePosition(event);
  shapeBox.width = Math.abs(location.x - startedPoint.x);
  shapeBox.height = Math.abs(location.y - startedPoint.y);
  shapeBox.x = location.x > startedPoint.x ? startedPoint.x : location.x;
  shapeBox.y = location.y > startedPoint.y ? startedPoint.y : location.y;
}

function getMousePosition({ clientX, clientY }) {
  const canvasSize = canvas.getBoundingClientRect();
  return {
    x: (clientX - canvasSize.left) * (canvas.width / canvasSize.width),
    y: (clientY - canvasSize.top) * (canvas.height / canvasSize.height),
  };
}

function saveCanvasImages() {
  savedImage = context.getImageData(0, 0, canvas.width, canvas.height);
}

function redrawCanvasImage() {
  context.putImageData(savedImage, 0, 0);
}

function changeTool(tool) {
  selectedTool = tool;
  document.querySelectorAll(".btn-tool").forEach((element) => {
    element.classList.remove("active");
  });
  document.getElementById(tool).classList.add("active");
}
