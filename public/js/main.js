// class Bubble (id, text, done, hidden, type, priority)
let Bubble = class {
  constructor(id, text, done, hidden, type, priority, connectedTo) {
    this.id = id;
    this.text = text;
    this.done = done;
    this.hidden = hidden;
    this.type = type; // 0 = Bubble | 1 -ToDo | 2 - ToProcess | 3 - Deleted
    this.priority = priority;
    this.connectedTo = [];
  }
};
let bubblesList = [];
// will control the dragging . Must be global.
let isDown = false;
let offset = [0, 0];
let draggedElement;
let arrayArrows = [];

// collect elements
let brainForm = document.getElementById("brainForm");
let subjectForm = document.getElementById("subjectForm");
let inputItem = document.getElementById("inputItem");
let inputSubject = document.getElementById("inputSubject");
let dragArea = document.getElementById("dragArea");
let toDos = document.getElementById("toDos");
let toProcess = document.getElementById("toProcess");

let bubbleForConnect1 = null;
let bubbleForConnect2 = null;

const audio1 = new Audio("audio/startconnecting.wav");
const audio2 = new Audio("audio/connected.wav");
const audioSet = new Audio("audio/setsubject.wav");
const audioDel = new Audio("audio/delBtn.wav");
const audioFinish = new Audio("audio/finished.wav");
const audioAdd = new Audio("audio/addbubble.wav");
const audioRadio = new Audio("audio/radiochange.wav");

let exportProcessBtn = document.getElementById("exportProcessBtn");
let exportToDoBtn = document.getElementById("exportToDoBtn");

//initial listeners
brainForm.addEventListener("submit", createBubble);
subjectForm.addEventListener("submit", maintainSubject);
exportProcessBtn.addEventListener("click", clickExportProcess);
exportToDoBtn.addEventListener("click", clickExportToDo);

let subjectFlag = false;
function maintainSubject(event) {
  event.preventDefault();
  audioAdd.play();
  if (!subjectFlag) {
    createSubject();
  } else {
    let mainSubject = document.getElementById("mainSubject");
    mainSubject.textContent = inputSubject.value;
  }
}

function createSubject() {
  let newSubject = document.createElement("div");
  let newSubTxt = document.createTextNode(inputSubject.value);
  newSubject.appendChild(newSubTxt);
  newSubject.setAttribute("id", "mainSubject");
  dragArea.insertBefore(newSubject, dragArea.firstChild);
  subjectFlag = true;
}

// part 2

// createBubble
function createBubble(event) {
  event.preventDefault();
  audioDel.play();

  //validates it's not empty
  if (isEmpty(inputItem.value)) {
    return;
  }

  let newBubble = document.createElement("div");
  let newTxt = document.createTextNode(inputItem.value);
  newBubble.appendChild(newTxt);
  newBubble.setAttribute("id", bubblesList.length);
  //*********************** IMPROVING DRAGGING */
  // newBubble.addEventListener("dragstart", startDrag);
  // newBubble.addEventListener("dragend", endDrag);
  newBubble.style.position = "absolute";

  // create new object
  newObj = new Bubble(
    bubblesList.length,
    inputItem.value,
    false,
    false,
    0, // // 0 = Bubble | 1 -ToDo | 2 - ToProcess | 3 - Deleted
    1
  );

  bubblesList.push(newObj);

  newArrowBtn = document.createElement("button");
  newArrowTxt = document.createTextNode(">");
  newArrowBtn.appendChild(newArrowTxt);
  newArrowBtn.classList.add("arrowBtn");
  newArrowBtn.addEventListener("click", arrowConnecting);

  // make draggable true attribute
  // newBubble.setAttribute("draggable", "true");
  // newBubble.style.position = "absolute";
  // randomX = Math.floor(Math.random * 400);
  // randomY = Math.floor(Math.random * 700);

  //make style position x random
  // make style position y random
  // newBubble.style.top = randomY + "px";
  // newBubble.style.left = randomX + "px";

  addDelBtn(newBubble, "delBtn");
  addCheckBtn(newBubble, "checkInput");

  newBubble.appendChild(newTxt);

  newBubble.appendChild(newArrowBtn);
  addRadio(newBubble, "radios", newObj.id, "kind");

  newBubble.addEventListener("mousedown", bubbleMouseDown);
  // newBubble.addEventListener("touchstart", bubbleMouseDown);

  document.addEventListener("mouseup", bubbleMouseUp);
  // document.addEventListener("touchend", bubbleMouseUp);
  // document.addEventListener("touchcancel", bubbleMouseUp);

  newBubble.addEventListener("mousemove", bubbleMouseMove);
  // newBubble.addEventListener("touchmove", bubbleMouseMove);

  newBubble.classList.add("thought");

  dragArea.appendChild(newBubble);

  inputItem.value = "";
}

function addRadio(location, styleType, id, name) {
  let divRadios = document.createElement("div");
  let divRadio1 = document.createElement("div");
  let divRadio2 = document.createElement("div");

  let radio1 = document.createElement("input");
  radio1.setAttribute("type", "radio");
  radio1.setAttribute("name", name + id);
  radio1.setAttribute("id", id + "radioD");
  let labelForRadio1 = document.createElement("label");
  labelForRadio1.setAttribute("for", id + "radio");
  let txtForLabelRadio1 = document.createTextNode("D");
  labelForRadio1.appendChild(txtForLabelRadio1);
  radio1.addEventListener("change", bubbleToDo);

  divRadio1.appendChild(radio1);
  divRadio1.appendChild(labelForRadio1);

  let radio2 = document.createElement("input");
  radio2.setAttribute("type", "radio");
  radio2.setAttribute("name", name + id);
  radio2.setAttribute("id", id + "radioT");
  let labelForRadio2 = document.createElement("label");
  labelForRadio2.setAttribute("for", id + "radioT");
  let txtForLabelRadio2 = document.createTextNode("T");
  labelForRadio2.appendChild(txtForLabelRadio2);
  radio2.addEventListener("change", bubbleToProcess);

  divRadio2.appendChild(radio2);
  divRadio2.appendChild(labelForRadio2);

  divRadios.appendChild(divRadio1);
  divRadios.appendChild(divRadio2);
  divRadios.classList.add(styleType);

  location.appendChild(divRadios);
  return [radio1, radio2];
}

function addDelBtn(location, styleType) {
  //create del btn
  let delBtn = document.createElement("button");
  let delBtnTxt = document.createTextNode("x");
  delBtn.appendChild(delBtnTxt);
  delBtn.classList.add(styleType);

  delBtn.addEventListener("click", removeBubble);
  location.appendChild(delBtn);
}

function addCheckBtn(location, styleType) {
  //create check button
  let newCheck = document.createElement("input"); // creating input
  newCheck.setAttribute("type", "checkbox");
  newCheck.classList.add(styleType);
  newCheck.addEventListener("change", completeTask);
  location.appendChild(newCheck);
}

function startDrag(event) {
  event.preventDefault();
}

function endDrag(event) {
  let _x = event.clientX;
  let _y = event.clientY;
  event.target.style.left = _x + "px";
  event.target.style.top = _y + "px";
  event.target.style.position = "absolute";
}

function isEmpty(str) {
  if (str === "") {
    return true;
  } else {
    return false;
  }
}

function removeBubble(event) {
  audioDel.play();
  let idDiv = event.target.parentNode.getAttribute("id");

  if (idDiv === null) {
    idDiv = event.target.parentNode.getAttribute("data-objid");
  }

  let index = bubblesList.findIndex((p) => p.id == idDiv);
  bubblesList[index]["hidden"] = true;
  let bubbleInDrag = document.getElementById(`${index}`);
  let bubbleInList = document.querySelector(`[data-objid="${index}"]`);
  bubbleInDrag.remove();
  bubbleInList.remove();
  //removing also from process and list
}

function completeTask(event) {
  audioFinish.play();
  let idDiv = event.target.parentNode.getAttribute("id");

  if (idDiv === null) {
    idDiv = event.target.parentNode.getAttribute("data-objid");
  }
  let index = bubblesList.findIndex((p) => p.id == idDiv);
  bubblesList[index]["done"] = event.target.checked;
  let bubbleInDrag = document.getElementById(`${index}`);
  let bubbleInList = document.querySelector(`[data-objid="${index}"]`);
  if (bubblesList[index]["done"]) {
    // event.target.parentNode.classList.add("finished");
    //also in process and list
    bubbleInDrag.classList.add("finished");
    bubbleInList.classList.add("finished");
  } else {
    // event.target.parentNode.classList.remove("finished");
    bubbleInDrag.classList.remove("finished");
    bubbleInList.classList.remove("finished");
  }
  //also in process and list
}

function findBubble(idToFind) {
  for (let bubble of bubblesList) {
    if (bubble.id == idToFind) {
      return bubble;
    }
  }
  return false;
}

function addToList(id, divList) {
  let obj = findBubble(id);
  let divEleToAdd = document.getElementById(divList);
  let divContainer = document.createElement("div");
  divContainer.addEventListener("dragstart", dragStart);
  // divContainer.addEventListener("touchstart", dragStart,);

  divContainer.addEventListener("dragenter", dragEnter);
  divContainer.addEventListener("dragover", dragOver);
  divContainer.addEventListener("dragleave", dragLeave);
  divContainer.addEventListener("dragend", dragEnd);
  // divContainer.addEventListener("touchend", dragEnd);
  // divContainer.addEventListener("touchcancel", dragEnd);

  divContainer.addEventListener("drop", dragDrop);
  divContainer.setAttribute("draggable", "true");
  divContainer.setAttribute("data-objid", id);
  let txtNode = document.createTextNode(obj.text);
  addDelBtn(divContainer, "delBtnList");
  addCheckBtn(divContainer, "checkInputList");
  divContainer.appendChild(txtNode);
  let radios = addRadio(divContainer, "radiosInList", id, "kind1");
  if (divList=="toDosList") {
    radios[0].checked = true;
  } else {radios[1].checked = true}
  divEleToAdd.appendChild(divContainer);
}

function bubbleToDo(event) {
  audioRadio.play();
  let radioId = event.target.getAttribute("id");
  let objId = event.target.getAttribute("id").slice(0, radioId.length - 6);
  let bubble = findBubble(parseInt(objId));
  if (bubble.type != 0) {
    removeFromList("toProcessList", objId);
  }
  findBubble(parseInt(objId)).type = 1;
  addToList(objId, "toDosList"); //will add to ToDo list
}

function bubbleToProcess(event) {
  audioRadio.play();
  let radioId = event.target.getAttribute("id");
  let objId = event.target.getAttribute("id").slice(0, radioId.length - 6);
  let bubble = findBubble(parseInt(objId));
  if (bubble.type != 0) {
    removeFromList("toDosList", objId);
  }
  findBubble(parseInt(objId)).type = 2;
  addToList(objId, "toProcessList"); //will add to ToDo list
}

function removeFromList(listToDelete, objId) {
  let holderDiv = document.querySelector("#" + listToDelete);
  let divList = holderDiv.childNodes;
  findDivById(divList, objId).remove();
}

function findDivById(divCol, id) {
  for (let divEle of divCol) {
    if (divEle.getAttribute("data-objID") == id) {
      return divEle;
    }
  }
}

function bubbleMouseDown(event) {
  isDown = true;
  ele = event.target;
  if (!ele.classList.contains("thought")) {
    ele = event.target.closest(".thought");
  }
  offset = [ele.offsetLeft - event.clientX, ele.offsetTop - event.clientY];
}

function bubbleMouseUp(event) {
  isDown = false;
}

function bubbleMouseMove(event) {
  let ele = event.target;
  event.preventDefault();
  if (!ele.classList.contains("thought")) {
    ele = event.target.closest(".thought");
  }
  if (isDown) {
    let mousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
    ele.style.left = mousePosition.x + offset[0] + "px";
    ele.style.top = mousePosition.y + offset[1] + "px";
  }
}

function dragStart(event) {
  draggedElement = event.target;
  event.target.classList.add("dragstart");
}

function dragEnter(event) {
  event.target.classList.add("dragenter");
}

function dragLeave(event) {
  event.target.classList.remove("dragenter");
}

function dragOver(event) {
  event.preventDefault();
}

function dragDrop(event) {
  let dropZoneName =
    findBubble(event.target.getAttribute("data-objid")).type == 1
      ? "toDosList"
      : "toProcessList";
  let dropZone = document.getElementById(dropZoneName);
  draggedElement.classList.remove("dragstart");
  event.target.classList.remove("dragenter");
  dropZone.insertBefore(draggedElement, event.target);
}

function dragEnd(event) {
  event.target.classList.remove("dragstart");
}

function arrowConnecting(event) {
  //identify if its first location or second
  if (bubbleForConnect1 === null) {
    bubbleForConnect1 = event.target.parentNode.id;
    audio1.play();
    return;
  } else if (bubbleForConnect1 === event.target.parentNode.id) {
    audio1.play();
    return;

    //need to add connection in memory
  } else {
    bubbleForConnect2 = event.target.parentNode.id;
    audio2.play();

    //need to add connection in memory
  }
  findBubble(bubbleForConnect1).connectedTo.push(bubbleForConnect2);
  newArrowDraw = document.createElement("connection");
  newArrowDraw.setAttribute("from", bubbleForConnect1);
  newArrowDraw.setAttribute("to", bubbleForConnect2);
  newArrowDraw.setAttribute("color", "rgba(35,121,129,0.75)");
  newArrowDraw.setAttribute("tail", "1");
  newArrowDraw.classList.add("arrowShow");
  newArrowDraw.addEventListener("dblclick", removeArrow);
  newArrowDraw.setAttribute("id", arrayArrows.length + "arrow");

  dragArea.appendChild(newArrowDraw);

  bubbleForConnect1 = null;
  bubbleForConnect2 = null;
}

function removeArrow(event) {
  event.target.parentNode.remove();
  audioDel.play();

  //need to remove connection from array
}

function exportToCsv(filename, rows) {
  let processRow = function (row) {
    let finalVal = "";
    for (let j = 0; j < row.length; j++) {
      let innerValue = row[j] === null ? "" : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      }
      let result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
      if (j > 0) finalVal += ",";
      finalVal += result;
    }
    return finalVal + "\n";
  };

  let csvFile = "";
  for (let i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  let blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    let link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      let url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

function clickExportProcess() {
  exportToCsv("export.csv", getBubbles(2));
}

function clickExportToDo() {
  exportToCsv("export.csv", getBubbles(1));
}

function getBubbles(typeWanted) {
  let arr = [["Id", "Bubble", "Type", "Connected To", "Done?"]];
  listWanted = (typeWanted == 1) ? "toDosList" : "toProcessList";
  divsWanted = document.querySelector("#" + listWanted).childNodes;
  for (let divWanted of divsWanted) {
    let objIdWanted = divWanted.getAttribute("data-objid");
    let objWanted = findBubble(objIdWanted);
    let txt = objWanted.text;
    let connectedTxt = connectedToTxt(objIdWanted)
    if (txt) { arr.push([`${objIdWanted}`, txt, listWanted, connectedTxt, objWanted.done]) }
  }
  return arr;
}

function connectedToTxt(num) {
  let str = "";
  str = findBubble(num).connectedTo.map(objid => {
    return findBubble(objid).text
  }).join(",");
  return str
}
