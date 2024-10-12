let list = [];
let flagList =[];

load();

function hideBtn(x, li) {

  x.onclick = function(event) {
    let list = JSON.parse(localStorage.getItem('List'));
    let flagList = JSON.parse(localStorage.getItem('Flags'));
    let itemText = li.childNodes[0].nodeValue.trim();
    console.log("Text: ", itemText);
    let listPos = list.indexOf(itemText);//texts position in list[]
    console.log("items position in List is: ", listPos);
    list.splice(listPos, 1);
    flagList.splice(listPos, 1);
    localStorage.setItem('List', JSON.stringify(list));
    localStorage.setItem('Flags', JSON.stringify(flagList));
    li.remove();
    console.log("Updated list:", list);
    event.stopPropagation();
  }
}

function rename(r, li) {
  r.onclick = function(event) {
    let list = JSON.parse(localStorage.getItem('List'));
    let itemText = li.childNodes[0].nodeValue.trim();
    console.log("Text: ", itemText);
    let listPos = list.indexOf(itemText);
    console.log("items position in List is: ", listPos);
    let r_input = prompt("Set new task name:");
    event.stopPropagation();
    if (!r_input || r_input.trim() === "") {
      console.log("den edwsa timh gia rename");
      r_input = itemText;
      return;
    } else {
      list.splice(listPos, 1, r_input);
      localStorage.setItem('List', JSON.stringify(list));
      console.log(list);
      li.childNodes[0].nodeValue = r_input;
      console.log("NEW NODE VALUE: ", r_input);
      complete(li);
    }
  }
}

function clearBtn(li) {
  let list = JSON.parse(localStorage.getItem('List'));
  let flagList = JSON.parse(localStorage.getItem('Flags'));
  list = [];
  flagList = [];
  localStorage.setItem('List', JSON.stringify(list));
  localStorage.setItem('Flags', JSON.stringify(flagList));
  const ul = document.getElementById("mainList");
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
}

function save(flag, item) {
  let list = localStorage.getItem('List');
  let flagList = localStorage.getItem('Flags');
  if (list == null){
    console.log(list);
    list = [];
    flagList =[];
  } else {
    list = JSON.parse(list);
    flagList = JSON.parse(flagList);
  }

  list.push(item);
  flagList.push(flag);

  localStorage.setItem('List', JSON.stringify(list));
  localStorage.setItem('Flags', JSON.stringify(flagList));
}

function load() {
  let list = localStorage.getItem("List");
  let flagList = localStorage.getItem("Flags");

  if (list != null) {
    list = JSON.parse(list);
    flagList = JSON.parse(flagList);

    list.forEach(function (item) {
      let li = document.createElement("li");
      let inputData = document.createTextNode(item);
      li.appendChild(inputData);
      document.getElementById("mainList").appendChild(li);
  
      const xbtn = document.createElement("button");
      xbtn.className = "close fa-solid fa-x";
      xbtn.appendChild(document.createElement("i"));
      li.appendChild(xbtn);

      const renameBtn = document.createElement("button");
      renameBtn.className = "btnRename fa-solid fa-pencil";
      renameBtn.appendChild(document.createElement("i"));
      li.appendChild(renameBtn);
      rename(renameBtn, li, inputData);

      //load Completed tasks
      let itemText = li.childNodes[0].nodeValue.trim();
      let list_pos = list.indexOf(itemText);
      let flag_value = flagList[list_pos];
      console.log('The list[] position of this li is: ', list_pos,'and the value is: ', flag_value);
      if (flag_value == 1){
        li.classList.add("completed");
      }

      hideBtn(xbtn, li);
      complete(li);
    });
  } 
}

function duplicates(input) {
  let list = localStorage.getItem('List');
  if (list == null){
    list = [];
  } else {
    list = JSON.parse(list);
  }
  let dupli_Check = list.find(function (element) {
    return element == input;// duplicate FOUND
  });
  if (dupli_Check == input) {
    alert("That task already exists!");
    return true;
  } else {
    return false;
  }
}

function complete(li) {
  li.onclick = function() {
    let list = JSON.parse(localStorage.getItem('List'));
    let flagList = JSON.parse(localStorage.getItem('Flags'));
    let itemText = li.childNodes[0].nodeValue.trim();
    let list_pos = list.indexOf(itemText);
    console.log('The list[] position of this li is: ', list_pos);
    let flag_value = flagList[list_pos];
    console.log('The flagList[] value was: ', flag_value);
    if (flag_value == 0){//COMPLETED
      this.classList.add("completed");
      //flagList.splice(list_pos, 1, 1);
      flagList[list_pos] = 1;
      flag_value = 1;
      console.log("task is completed and flag is: ", flag_value);
    } else {//INCOMPLETED
      this.classList.remove("completed");
      //flagList.splice(list_pos, 1, 0);
      flagList[list_pos] = 0;
      flag_value = 0;
      console.log("task is NOT completed and flag is: ", flag_value);
    }
    localStorage.setItem('Flags', JSON.stringify(flagList));
    localStorage.setItem('List', JSON.stringify(list));
  }
}

function liAppend() {
  //Empty Input Alert
  if (document.getElementById("input_data").value == "") {
    alert("This field cannot be left empty.");
  } else {
    const li = document.createElement("li");
    let inputData = document.getElementById("input_data").value;
    let text = document.createTextNode(inputData);    
    //Duplicate Check
    let dupli_return = duplicates(inputData);
    if (dupli_return == true) {
      document.getElementById("input_data").value = "";
      return;
    } else if (dupli_return == null) {
      li.appendChild(text);
      document.getElementById("mainList").appendChild(li);
      document.getElementById("input_data").value = "";
    }else {
      li.appendChild(text);
      document.getElementById("mainList").appendChild(li);
      document.getElementById("input_data").value = "";
    }

    //new X btn
    const xbtn = document.createElement("button");
    xbtn.className = "close fa-solid fa-x";
    xbtn.appendChild(document.createElement("i"));
    li.appendChild(xbtn);
    hideBtn(xbtn, li);

    //Rename Btn
    const renameBtn = document.createElement("button");
    renameBtn.className = "btnRename fa-solid fa-pencil";
    renameBtn.appendChild(document.createElement("i"));
    li.appendChild(renameBtn);
    rename(renameBtn, li);
    //flag
    let flag = 0;

    save(flag, inputData);

    complete(li);
  }
}

const blank_input = document.getElementById("input_data");
//Uses Enter via keyboard to Add LI
blank_input.addEventListener("keypress", function(e){
  if (e.key === "Enter" || e.which == 13){
    liAppend();
  }
}, false);