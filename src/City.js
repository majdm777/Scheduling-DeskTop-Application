// array of strings contains images path for each lvl
let HouseSmall=["building_icons/Base_0.png","building_icons/Building_Level_1_Small.png","building_icons/Building_Level_2_Small.png","building_icons/Final_House_Small.png"]
let HouseSmallX=["building_icons/Base_0.png","building_icons/Building_Level_1_Small.png","building_icons/Building_Level_2_Small.png","building_icons/Final_House_Small+.png"]
let HouseMedium =["building_icons/Base_0.png","building_icons/Building_Level_1_Medium.png","building_icons/Building_Level_2_Medium.png","building_icons/Building_Level_3_Medium.png","building_icons/Final_House_Medium.png"]
let HouseMediumX =["building_icons/Base_0.png","building_icons/Building_Level_1_Medium.png","building_icons/Building_Level_2_Medium.png","building_icons/Building_Level_3_Medium.png","building_icons/Final_House_Medium+.png"]
let HouseLarge=["building_icons/Base_0.png","building_icons/Building_Level_1_Large.png","building_icons/Building_Level_2_Large.png","building_icons/Building_Level_3_Large.png","building_icons/Building_Level_4_Large.png","building_icons/Building_Level_5_Large.png","building_icons/Final_House_Large.png"]
let HouseLargeX=["building_icons/Base_0.png","building_icons/Building_Level_1_Large.png","building_icons/Building_Level_2_Large.png","building_icons/Building_Level_3_Large.png","building_icons/Building_Level_4_Large.png","building_icons/Building_Level_5_Large.png","building_icons/Final_House_Large+.png"]
let HouseLargeExtra=["building_icons/Base_extra.png","building_icons/Building_Level_1_Large.png","building_icons/Building_Level_2_Large.png","building_icons/Building_Level_3_Large.png","building_icons/Building_Level_4_Large.png","building_icons/Building_Level_5_Large.png","building_icons/Final_House_Extra_Large.png"]

let MainBuilding=["building_icons/MainBuilding_Bank.png","building_icons/MainBuilding_Hospital.png","building_icons/MainBuilding_Factory.png","building_icons/MainBuilding_Business.png","building_icons/MainBuilding_School.png","building_icons/MainBuilding_Restaurant.png"]
let Accessories=["building_icons/Acc_tree.png","building_icons/Acc_people-1.png","building_icons/Acc_car-1.png","building_icons/Acc_car-2.png","building_icons/Acc_car-3.png"]



function getScheduleName(){
    const temp = new URLSearchParams(window.location.search);
    return temp.get("name")
}
const SCHEDULE_NAME=getScheduleName();
let COURSES=[]
let CHAPTERS=[]
let ASSIGNED_CHAPTERS=[];
let SCHEDULE=[];
let DEFAULT_DATE;
let NUMBER_OF_DAYS;

let IfElse_Counter=0;

let size = 5;
let tiles = [];

async function loadInfo() {
    let MESSAGE = document.querySelector("#Msge")
    if (!window.api?.getSchedule || !window.api?.getCourses || !window.api?.getChapters || !window.api?.getAssignedChapters) {
        MESSAGE.innerHTML="Failed to load Schedule."
        return false;
    }


    if(!SCHEDULE_NAME) return false;
    SCHEDULE = (await window.api.getSchedule(SCHEDULE_NAME))[0];
    COURSES = await window.api.getCourses(SCHEDULE_NAME);
    CHAPTERS = await window.api.getChapters(SCHEDULE_NAME);
    ASSIGNED_CHAPTERS = await window.api.getAssignedChapters(SCHEDULE_NAME);
    DEFAULT_DATE =SCHEDULE.start_date;
    NUMBER_OF_DAYS = ASSIGNED_CHAPTERS.length;
    document.querySelector("#City_Name").innerHTML=`${SCHEDULE_NAME}'s City`

    console.log(SCHEDULE)
    console.log(COURSES)
    console.log(CHAPTERS)
    console.log(ASSIGNED_CHAPTERS)

    



    size =Math.ceil(Math.sqrt(NUMBER_OF_DAYS)*1.2);

    IfElse_Counter += 2;
    return true ;
}

loadInfo().then(result => {
    if (!result) {
        document.querySelector(".Msge").innerHTML = "failed";
    }
    IfElse_Counter++
    generateHouse_ForEachCourse();
    grid.style.setProperty("--cols", size);
    createGrid();
});





const grid = document.getElementById("grid");






let cityData = [];
let usedIndexes = new Set();
function generateHouse_ForEachCourse() {
  const totalTiles = size * size;

  // create empty grid
  cityData = new Array(totalTiles).fill(null);

  

  for (let course of COURSES) {

    // ✅ get unique random index
    let index;
    do {
      index = Math.floor(Math.random() * totalTiles);
    } while (usedIndexes.has(index));

    usedIndexes.add(index);

    let chapters = course.Number_Of_Chapters;
    let image = "";
    let Type = ''
    

    const now = new Date();
    const start = new Date(SCHEDULE.start_date);
    const end = new Date(SCHEDULE.end_date);

    const dayIndex = getDayIndex(SCHEDULE.start_date);

    if (now < start) {
      image = "building_icons/under-construction..png";
    }
    else if (now >= start && now <= end) {

      if (chapters <= 2) {
        image = getLevel(HouseSmall, dayIndex);
        Type="HouseSmall";
      } 
      else if (chapters <= 4) {
        image = getLevel(HouseSmallX, dayIndex);
        Type="HouseSmall+";
      } 
      else if (chapters <= 6) {
        image = getLevel(HouseMedium, dayIndex);
        Type="HouseMedium";
      } 
      else if (chapters <= 8) {
        image = getLevel(HouseMediumX, dayIndex);
        Type="HouseMedium+";
      } 
      else if (chapters <= 10) {
        image = getLevel(HouseLarge, dayIndex);
        Type="HouseLarge";
      } 
      else if (chapters <= 12) {
        image = getLevel(HouseLargeX, dayIndex);
        Type="HouseLarge+";
      } 
      else {
        image = getLevel(HouseLargeExtra, dayIndex);
        Type="HouseLargeExtra";
      }

    }
    else {
      // finished → final stage
      if (chapters <= 2){ image = HouseSmall.at(-1);  Type="HouseSmall";}
      else if (chapters <= 4){ image = HouseSmallX.at(-1);  Type="HouseSmall+";}
      else if (chapters <= 6){ image = HouseMedium.at(-1); Type="HouseMedium";}
      else if (chapters <= 8){ image = HouseMediumX.at(-1); Type="HouseMedium+";}
      else if (chapters <= 10){ image = HouseLarge.at(-1); Type="HouseLarge";}
      else if (chapters <= 12){ image = HouseLargeX.at(-1); Type="HouseLarge+";}
      else{ image = HouseLargeExtra.at(-1); Type="HouseLargeExtra";}
    }



    cityData[index] = {
      course: course,
      type: Type,
      image: image
    };
  }
  generateDefaultBuildings()
}

function generateDefaultBuildings() {

  const totalTiles = size * size;

  let availableSpace = totalTiles - COURSES.length;
  if (availableSpace <= 0) return;

  let spaceForMainBuilding = Math.ceil(availableSpace / 2);
  let spaceForAccessories = availableSpace - spaceForMainBuilding;

  let number_of_MainBuilding = Math.ceil(COURSES.length/2);
  let number_Of_Accessories = Math.floor(number_of_MainBuilding/2);


  /* ===== MAIN BUILDINGS ===== */
  for (let i = 0; i < number_of_MainBuilding; i++) {




    if (i >= MainBuilding.length) break;

    let index;
    do {
      index = Math.floor(Math.random() * totalTiles);
    } while (usedIndexes.has(index));
    usedIndexes.add(index);

    switch(i){
      case 0 :{
        cityData[index] = {
          course:"Done",
          type:"Bank",
          image: MainBuilding[i]
        };
        break;
      }

      case 1:{
        cityData[index] = {
          course: "Done",
          type: "Hospital",
          image: MainBuilding[i]
        };
        break;        
      }

      case 2:{
        cityData[index] = {
          course: null,
          type: "Factory",
          image: MainBuilding[i]
        };
        break;       
      }

      case 3:{
        cityData[index] = {
        course: null,
        type: "Business",
        image: MainBuilding[i]
        }; 
        break;
      }

      default : break;
    }

    


  }

  /* ===== ACCESSORIES ===== */
  for (let i = 0; i < number_Of_Accessories; i++) {

    if (i >= Accessories.length) break;

    let index;
    do {
      index = Math.floor(Math.random() * totalTiles);
    } while (usedIndexes.has(index));
    usedIndexes.add(index);

    switch(i){
      case 0 :{
        cityData[index] = {
          course: null,
          type: "Accessories",
          image: Accessories[i]
        };
      }

      case 1:{
        cityData[index] = {
          course: null,
          type: "Accessories",
          image: Accessories[i]
        };        
      }

      case 2:{
        cityData[index] = {
          course: null,
          type: "Accessories",
          image: Accessories[i]
        };       
      }

      case 3:{
        cityData[index] = {
        course: null,
        type: "Accessories",
        image: Accessories[i]
        }; 
      }

      case 4:{
        cityData[index] = {
        course: null,
        type: "Accessories",
        image: Accessories[i]
        }; 
      }

      default : break;
    }
  }
}
// 

/* ===== CREATE GRID ===== */
function createGrid() {
  grid.style.gridTemplateColumns =`repeat(${size},120px)`
  for (let i = 0; i <size*size; i++) {
    const tile = createTile(cityData[i], i);


    let animationInterval;
    if (cityData[i] && cityData[i].type === "Hospital") {
      tile.addEventListener("click", () => openHospital());
    }

  tile.addEventListener("mousemove", function (e) {
    let tooltip = document.getElementById("tooltip");

    positionTooltip(e, tooltip);
    tooltip.style.display = "block";

    if (!cityData[i] || cityData[i].course === null) {
      tooltip.innerHTML = `<h3 style="color:black"> ...                 </h3>`;
      return;
    }
    
    if(cityData[i].type === "Bank"){
      let nb_MissedChap=0;
      let nb_CompletedChap=0;
      let nb_NotCompletedChap=0;
      for(chap of CHAPTERS){
        if(chap.State === "Chapter Missed"){
          nb_MissedChap++
        }else if(chap.State==="Completed"){
          nb_CompletedChap++
        }else if(chap.State==="Not Completed"){
          nb_NotCompletedChap++
        }
      }

      tooltip.innerHTML = `<img id="tooltipImg" class="tooltipImage" src="${cityData[i].image}">
                          <br><h3>Bank</h3>
                          <hr>
                          <h4>Number of Completed Chapters is : ${nb_CompletedChap}</h4>
                          <hr>
                          <h4>Number of Not-Completed Chapters is : ${nb_NotCompletedChap}</h4>
                          <hr>
                          <h4>Number of Missed Chapters is : ${nb_MissedChap}</h4>
                          <hr>                                                    
                          `;
      return;           
    }
    if(cityData[i].type === "Hospital"){
        tooltip.innerHTML = `
                        <img class="tooltipImage" src="${cityData[i].image}">
                        <h3>Hospital</h3>
                        <hr>
                        <p>Here you can revive your Missed Chapter</p>
                        <p>by rescheduling them to the current day
                        </p>
                      `;
                      
      return;       
    }


    if(cityData[i].type === "Accessories"){
      tooltip.innerHTML = `<h3 style="color:black"> ...                 </h3>`;
      return;      
    }    
    let chapter = CHAPTERS
        .filter(chap => chap.ForCourse === cityData[i].course.name);

    let houseLifeTime = getHouseDesignArray(cityData[i].course.Number_Of_Chapters);

    let index = 0;

    clearInterval(animationInterval); // stop previous animation

    tooltip.innerHTML = `
        <img id="tooltipImg" class="tooltipImage" src="${houseLifeTime[0]}">
        <h3>${cityData[i].course.name}</h3>
        ${chapter.map(c => `${c.name} - ${c.State}`).join("<br>")}
    `;

    animationInterval = setInterval(() => {
        index = (index +1) % houseLifeTime.length;

        document.getElementById("tooltipImg").src = houseLifeTime[index];
    }, 500); // speed (ms)
  });

    tile.addEventListener("mouseleave", function () {
        document.getElementById("tooltip").style.display = "none";
        clearInterval(animationInterval);
    });  
    tiles.push(tile);

    grid.appendChild(tile);

  }

  updateRoads();
}

/* ===== CREATE TILE ===== */
function createTile(data, index) {
  const tile = document.createElement("div");
  tile.classList.add("tile");

  const top = document.createElement("div");
  top.classList.add("top");

  const side = document.createElement("div");
  side.classList.add("side");

  const road = document.createElement("div");
  road.classList.add("road");

  tile.appendChild(top);
  tile.appendChild(side);
  tile.appendChild(road);

  /* render building from data */
  if (data && data.type) {
    const img = document.createElement("img");
    img.src = data.image;
    img.classList.add("building-img");

    tile.appendChild(img);
  }
  IfElse_Counter++

  return tile;
}

/* ===== SMART ROADS ===== */
function updateRoads() {
  tiles.forEach((tile, index) => {
    const road = tile.querySelector(".road");
    road.innerHTML = "";

    if (!tile.querySelector(".building-img")) return;

    const x = index % size;

    const neighbors = {
      top: tiles[index - size],
      bottom: tiles[index + size],
      left: x > 0 ? tiles[index - 1] : null,
      right: x < size - 1 ? tiles[index + 1] : null
    };

    for (let dir in neighbors) {
      if (
        neighbors[dir] &&
        neighbors[dir].querySelector(".building-img")
      ) {
        const span = document.createElement("span");
        span.classList.add(dir);
        road.appendChild(span);
      }
    }
    IfElse_Counter++
  });
}


function getLevel(arr, day) {
  return arr[Math.min(day, arr.length - 1)];
}

function getDayIndex(startDate) {
  const now = new Date();
  const start = new Date(startDate);

  now.setHours(0,0,0,0);
  start.setHours(0,0,0,0);

  return Math.floor((now - start) / (1000 * 60 * 60 * 24));
}


function getHouseDesignArray( numberOfChapters){

      if (numberOfChapters <= 2){ return HouseSmall}
      else if (numberOfChapters <= 4){ return HouseSmallX}
      else if (numberOfChapters <= 6){ return HouseMedium}
      else if (numberOfChapters <= 8){ return HouseMediumX}
      else if (numberOfChapters <= 10){ return HouseLarge}
      else if (numberOfChapters <= 12){ return HouseLargeX}
      else{ return HouseLargeExtra}
}


function positionTooltip(e, tooltip) {
  const offset = 15;

  const tooltipWidth = tooltip.offsetWidth;
  const tooltipHeight = tooltip.offsetHeight;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  let x = e.clientX + offset;
  let y = e.clientY + offset;

  
  if (x + tooltipWidth > screenWidth) {
    x = e.clientX - tooltipWidth - offset;
  }

  
  if (y + tooltipHeight > screenHeight) {
    y = e.clientY - tooltipHeight - offset;
  }

  tooltip.style.left = x + "px";
  tooltip.style.top = y + "px";
}


function openPopup() {
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {

    document.getElementById("popup").style.display = "none";
}

function openHospital() {

  let container = document.querySelector("#chaptersContainer");
  container.innerHTML = "";

  const missed = CHAPTERS.filter(chap => chap.State === "Chapter Missed");

  if (missed.length === 0) {
    container.innerHTML = `<p style="text-align:center;">✅ No missed chapters</p>`;
    openPopup();
    return;
  }

  missed.forEach(chap => {

    const card = document.createElement("div");
    card.classList.add("chapter-card");

    const title = document.createElement("h3");
    title.classList.add("chapter-title");
    title.innerText = `${chap.ForCourse} - ${chap.name}`;

    const status = document.createElement("span");
    status.classList.add("chapter-status");
    status.innerText = "MISSED";

    const btn = document.createElement("button");
    btn.classList.add("recover-btn");
    btn.innerText = "Recover";

    btn.addEventListener("click", () => {
      let currentDate = new Date();
      currentDate.setHours(0,0,0,0);

      chap.date = currentDate.toISOString().split("T")[0];
      chap.State = "Rescheduled";

      let newAssign = ASSIGNED_CHAPTERS.find(
        cha => cha.DATE === chap.date && cha.Schedule_Name === SCHEDULE_NAME
      );
      if (newAssign) newAssign.Count++;

      // 🎬 trigger animation
      card.classList.add("recovered");

      // disable button
      btn.disabled = true;

      // 🧼 remove after animation
      setTimeout(() => {
        card.remove();
      }, 500);
    });

    card.appendChild(title);
    card.appendChild(status);
    card.appendChild(btn);

    container.appendChild(card);
  });

  openPopup();
}


function saveChanges(){

  CHAPTERS.forEach(chapter =>{
      window.api.updateChapter({
          chapter : chapter
      })
  })

  COURSES.forEach(course =>{
      window.api.updateCourse({
          course : course
      })
  })

  window.api.updateSchedule({
      schedule : SCHEDULE
  });

  ASSIGNED_CHAPTERS.forEach(assigned =>{
    window.api.UpdateAssignedChapters({
      assigned_chapter : assigned
    });
  })


  closePopup()

  console.log(SCHEDULE)
  console.log(COURSES)
  console.log(CHAPTERS)
  console.log(ASSIGNED_CHAPTERS)
}