// class Bubble (id, text, done, hidden, type, priority)
let Bubble = class {
  constructor(
    id,
    text,
    done,
    hidden,
    type,
    priority,
    followBy,
    start_date,
    end_date,
    description,
    positionx,
    positiony
  ) {
    this.id = id;
    this.text = text; // head
    this.description = description;
    this.done = done;
    this.hidden = hidden;
    this.type = type; // status // 0 = Bubble | 1 -ToDo | 2 - ToProcess | 3 - Deleted
    this.priority = priority;
    this.followBy = [];
    this.start_date = start_date;
    this.end_date = end_date;
    this.positionx = positionx;
    this.positiony = positiony;
  }
};
let bubblesList = [];
// will control the dragging . Must be global.
let isDown = false;
let offset = [0, 0];
let draggedElement;
let arrayArrows = [];
let subject_id;
let regiCount = 0;
let logiCount = 0;

let logged_user = {
  logged: false,
  user_id: null,
};

// collect elements
let brainForm = document.getElementById("brainForm");
let subjectForm = document.getElementById("subjectForm");
let inputItem = document.getElementById("inputItem");
let inputSubject = document.getElementById("inputSubject");
let dragArea = document.getElementById("dragArea");
let toDos = document.getElementById("toDos");
let toProcess = document.getElementById("toProcess");
var w = window.innerWidth;
var h = window.innerHeight;

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

let subjectFlag = false;
function maintainSubject(event) {
  event.preventDefault();
  console.log(subjectFlag);
  audioAdd.play();
  if (!subjectFlag) {
    createSubject();
  } else {
    let mainSubject = document.getElementById("mainSubject");
    mainSubject.textContent = inputSubject.value;
  }
}

function createSubject() {
  console.log(inputSubject.value);
  let newSubject = document.createElement("div");
  let newSubTxt = document.createTextNode(inputSubject.value);
  newSubject.appendChild(newSubTxt);
  newSubject.setAttribute("id", "mainSubject");
  dragArea.insertBefore(newSubject, dragArea.firstChild);
  subjectFlag = true;

  // TODO: if logged in save subject
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

  let randomX = Math.floor(Math.random() * w * 0.6);
  let randomY = Math.floor(Math.random() * h * 0.78 * 0.75);

  // create new object (id, text, done, hidden, type, priority, followBy, start_date,end_date,description,positionx,positiony)
  let newObj = new Bubble(
    bubblesList.length,
    inputItem.value,
    false,
    false,
    0, // // 0 = Bubble | 1 -ToDo | 2 - ToProcess | 3 - Deleted
    1
  );

  newObj.positionx = Math.round((randomX / w) * 100); //in VW
  newObj.positiony = Math.round((randomY / h) * 100); // in VH

  bubblesList.push(newObj);
  MakeBubbles(inputItem.value, newObj.positiony, newObj.positionx, newObj.id);
  inputItem.value = "";
}

function MakeBubbles(str, positiony, positionx, id) {
  let newBubble = document.createElement("div");
  let newTxt = document.createTextNode(str);
  newBubble.appendChild(newTxt);
  newBubble.setAttribute("id", id);
  //*********************** IMPROVING DRAGGING */
  // newBubble.addEventListener("dragstart", startDrag);
  // newBubble.addEventListener("dragend", endDrag);
  newBubble.style.position = "absolute";
  newArrowBtn = document.createElement("button");
  newArrowTxt = document.createTextNode(">");
  newArrowBtn.appendChild(newArrowTxt);
  newArrowBtn.classList.add("arrowBtn");
  newArrowBtn.addEventListener("click", arrowConnecting);

  // make draggable true attribute
  // newBubble.setAttribute("draggable", "true");
  // newBubble.style.position = "absolute";

  //make style position x random
  // make style position y random
  // newBubble.style.top = randomY + "px";
  // newBubble.style.left = randomX + "px";

  addDelBtn(newBubble, "delBtn");
  addCheckBtn(newBubble, "checkInput");

  newBubble.appendChild(newTxt);

  newBubble.appendChild(newArrowBtn);
  addRadio(newBubble, "radios", id, "kind");

  newBubble.addEventListener("mousedown", bubbleMouseDown);
  // newBubble.addEventListener("touchstart", bubbleMouseDown);

  document.addEventListener("mouseup", bubbleMouseUp);
  // document.addEventListener("touchend", bubbleMouseUp);
  // document.addEventListener("touchcancel", bubbleMouseUp);

  newBubble.addEventListener("mousemove", bubbleMouseMove);
  // newBubble.addEventListener("touchmove", bubbleMouseMove);

  //rapper for position
  newBubble.classList.add("thought");
  newBubble.style.top = `${positiony}vh`;
  newBubble.style.left = `${positionx}vw`;
  dragArea.appendChild(newBubble);
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
  let id = event.target.closest(".thought");
  let index = findBubble(id);
  bubblesList[index].positionx = Math.round((_x / w) * 100);
  bubblesList[index].positiony = Math.round((_y / h) * 100);
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
  let idDiv = event.target.closest(".thought").getAttribute("id");

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
  if (divList == "toDosList") {
    radios[0].checked = true;
  } else {
    radios[1].checked = true;
  }
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
  findBubble(bubbleForConnect2).followBy.push(bubbleForConnect1);
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

let mainSubjectId; //saving on the global

async function saving() {
  await getsubjectID();
  await savingTasks();

  console.log();
}

async function getsubjectID() {
  let mainSubject = document.getElementById("mainSubject");

  if (mainSubject != null) {
    let name = mainSubject.innerText.toUpperCase();

    if (logged_user.logged) {
      let { user_id } = logged_user;

      try {
        let sub_id = await fetch("http://localhost:5000/savesubject", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ name, user_id }),
        }).then((res) => res.json());
        // .catch(err=>console.log(err , "at subject id fetching")
        console.log(sub_id, "all went ok");

        let { subject_id } = sub_id;
        mainSubjectId = subject_id;
        console.log(subject_id, "this is the subject number");
      } catch (err) {
        console.log(err, "at getting subjectID ");
      }
    } else {
      let errorloggin = document.getElementById("errorloggin");
      errorloggin.classList.remove("hidden");
      setTimeout(() => {
        errorloggin.classList.add("hidden");
      }, 2500);
    }
  } else {
    let errorSubject = document.getElementById("errorSubject");
    errorSubject.classList.remove("hidden");
    setTimeout(() => {
      errorSubject.classList.add("hidden");
    }, 2500);
  }
}

async function savingTasks() {
  try {
    let subject_id = mainSubjectId;
    console.log(subject_id, "this is the subject number");
    let savingDetail = await fetch("http://localhost:5000/save", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ bubblesList, subject_id }),
    }).then((res) => res.json());

    console.log(savingDetail);
  } catch (err) {
    console.log(err, "at saving ");
  }
}

function successRegi() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let fName = document.getElementById("name").value;
  let lName = document.getElementById("lName").value;
  let email = document.getElementById("email").value;
  let submitRegi = document.getElementById("submitRegi");
  if (
    username != "" &&
    password != "" &&
    lName != "" &&
    email != "" &&
    fName != ""
  ) {
    submitRegi.disabled = false;
  } else {
    submitRegi.disabled = true;
  }
}

function successLogin() {
  let usernameL = document.getElementById("username").value;
  let passwordL = document.getElementById("password").value;
  let submit = document.getElementById("submit");
  if (username != "" && password != "") {
    submitLogin.disabled = false;
  } else {
    submitLogin.disabled = true;
  }
}

function register(event) {
  event.preventDefault();
  let username = document.getElementById("username").value.toLowerCase();
  let password = document.getElementById("password").value;
  let fName = document.getElementById("name").value.toLowerCase();
  let lName = document.getElementById("lName").value.toLowerCase();
  let email = document.getElementById("email").value.toLowerCase();
  let register_info = document.getElementById("register_info");

  fetch("http://localhost:5000/register", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ username, password, fName, lName, email }),
  })
    .then((res) => res.json())
    .then((str) => {
      console.log("sent request received detail");
      register_info.innerText = str;
    })
    .catch((err) => console.log(err));
}

function login(event) {
  event.preventDefault();
  let username = document.getElementById("usernameL").value.toLowerCase();
  let password = document.getElementById("passwordL").value;
  let login_info = document.getElementById("login_info");
  fetch("http://localhost:5000/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("sent request received detail");
      console.log(res);
      logged_user.logged = true;
      logged_user.user_id = res[1];
      login_info.innerText = res[0];
      loadUserSubjects(logged_user.user_id);

      console.log(logged_user);
    })
    .catch((err) => {
      console.log(err);
      login_info.innerText =
        "login information was not ok username or password not exist";
    });
}

async function loadUserSubjects(id) {
  let response = await fetch(`http://localhost:5000/subjects/${id}`)
    .then((res) => res.json())
    .catch((err) => console.log(err));

  addSubjects(response);
}

function addSubjects(data) {
  console.log(data);
  let navBarLinks = document.getElementById("navBarLinks");
  data.forEach((v) => {
    let newLi = document.createElement("li");
    newLi.classList.add("nav-item");
    let newA = document.createElement("a");
    newA.innerText = v.subject_name;
    newA.classList.add("nav-link");
    newA.classList.add("active");
    newA.style.color = "rgb(35,121,129)";
    newA.style.fontWeight = "bold";
    newLi.appendChild(newA);
    navBarLinks.appendChild(newLi);
  });
}

function displayLogin() {
  let login = document.getElementById("login");
  let needToRegi = document.getElementById("needToRegi");
  if (logiCount % 2 == 0) {
    login.style.display = "block";
    needToRegi.style.display = "block";
    login.style.margin = "auto";
    logiCount++;
  } else {
    login.style.display = "none";
    needToRegi.style.display = "none";
    logiCount++;
  }
}

function displayRegister() {
  let register = document.getElementById("register");
  let needTologi = document.getElementById("needTologi");
  if (regiCount % 2 == 0) {
    register.style.display = "block";
    needTologi.style.display = "block";
    register.style.margin = "auto";
    regiCount++;
  } else {
    register.style.display = "none";
    needTologi.style.display = "none";
    regiCount++;
  }
}

function switchForm() {
  displayLogin();
  displayRegister();
}

// warning msg must be logged in

//TODO: creating saving function

// function exportToCsv(filename, rows) {
//   let processRow = function (row) {
//     let finalVal = "";
//     for (let j = 0; j < row.length; j++) {
//       let innerValue = row[j] === null ? "" : row[j].toString();
//       if (row[j] instanceof Date) {
//         innerValue = row[j].toLocaleString();
//       }
//       let result = innerValue.replace(/"/g, '""');
//       if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
//       if (j > 0) finalVal += ",";
//       finalVal += result;
//     }
//     return finalVal + "\n";
//   };

//   let csvFile = "";
//   for (let i = 0; i < rows.length; i++) {
//     csvFile += processRow(rows[i]);
//   }

//   let blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
//   if (navigator.msSaveBlob) {
//     navigator.msSaveBlob(blob, filename);
//   } else {
//     let link = document.createElement("a");
//     if (link.download !== undefined) {
//       // feature detection
//       let url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute("download", filename);
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   }
// }

// function clickExportProcess() {
//   exportToCsv("export.csv", getBubbles(2));
// }

// function clickExportToDo() {
//   exportToCsv("export.csv", getBubbles(1));
// }

// function getBubbles(typeWanted) {
//   let arr = [["Id", "Bubble", "Type", "Connected To", "Done?"]];
//   listWanted = typeWanted == 1 ? "toDosList" : "toProcessList";
//   divsWanted = document.querySelector("#" + listWanted).childNodes;
//   for (let divWanted of divsWanted) {
//     let objIdWanted = divWanted.getAttribute("data-objid");
//     let objWanted = findBubble(objIdWanted);
//     let txt = objWanted.text;
//     let connectedTxt = connectedToTxt(objIdWanted);
//     if (txt) {
//       arr.push([
//         `${objIdWanted}`,
//         txt,
//         listWanted,
//         connectedTxt,
//         objWanted.done,
//       ]);
//     }
//   }
//   return arr;
// }

// function connectedToTxt(num) {
//   let str = "";
//   str = findBubble(num)
//     .connectedTo.map((objid) => {
//       return findBubble(objid).text;
//     })
//     .join(",");
//   return str;
// }
