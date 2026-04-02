// array of strings contains images path for each lvl
let HouseSmall=["building_icons/Base_0.png","building_icons/Building_Level_1_Small.png","building_icons/Building_Level_2_Small.png","building_icons/Final_House_Small.png"]
let HouseSmallX=["building_icons/Base_0.png","building_icons/Building_Level_1_Small.png","building_icons/Building_Level_2_Small.png","building_icons/Final_House_Small+.png"]
let HouseMedium =["building_icons/Base_0.png","building_icons/Building_Level_1_Medium.png","building_icons/Building_Level_2_Medium.png","Building_Level_3_Medium.png","building_icons/Final_House_Medium.png"]
let HouseMediumX =["building_icons/Base_0.png","building_icons/Building_Level_1_Medium.png","building_icons/Building_Level_2_Medium.png","Building_Level_3_Medium.png","building_icons/Final_House_Medium+.png"]
let HouseLarge=["building_icons/Base_0.png","building_icons/Building_Level_1_Large.png","building_icons/Building_Level_2_Large.png","Building_Level_3_Large.png","Building_Level_4_Large.png","Building_Level_5_Large.png","building_icons/Final_House_Large.png"]
let HouseLargeX=["building_icons/Base_0.png","building_icons/Building_Level_1_Large.png","building_icons/Building_Level_2_Large.png","Building_Level_3_Large.png","Building_Level_4_Large.png","Building_Level_5_Large.png","building_icons/Final_House_Large+.png"]
let HouseLargeExtra=["building_icons/Base_extra.png","building_icons/Building_Level_1_Large.png","building_icons/Building_Level_2_Large.png","Building_Level_3_Large.png","Building_Level_4_Large.png","Building_Level_5_Large.png","building_icons/Final_House_Extra_Large.png"]





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

    console.log(SCHEDULE)
    console.log(COURSES)
    console.log(CHAPTERS)
    console.log(ASSIGNED_CHAPTERS)

    



    size =Math.ceil(NUMBER_OF_DAYS/2);;

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

function generateHouse_ForEachCourse() {
  const totalTiles = size * size;

  // create empty grid
  cityData = new Array(totalTiles).fill(null);

  let usedIndexes = new Set();

  for (let course of COURSES) {

    // ✅ get unique random index
    let index;
    do {
      index = Math.floor(Math.random() * totalTiles);
    } while (usedIndexes.has(index));

    usedIndexes.add(index);

    let chapters = course.Number_Of_Chapters;
    let image = "";

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
      } 
      else if (chapters <= 4) {
        image = getLevel(HouseSmallX, dayIndex);
      } 
      else if (chapters <= 6) {
        image = getLevel(HouseMedium, dayIndex);
      } 
      else if (chapters <= 8) {
        image = getLevel(HouseMediumX, dayIndex);
      } 
      else if (chapters <= 10) {
        image = getLevel(HouseLarge, dayIndex);
      } 
      else if (chapters <= 12) {
        image = getLevel(HouseLargeX, dayIndex);
      } 
      else {
        image = getLevel(HouseLargeExtra, dayIndex);
      }

    }
    else {
      // finished → final stage
      if (chapters <= 2) image = HouseSmall.at(-1);
      else if (chapters <= 4) image = HouseSmallX.at(-1);
      else if (chapters <= 6) image = HouseMedium.at(-1);
      else if (chapters <= 8) image = HouseMediumX.at(-1);
      else if (chapters <= 10) image = HouseLarge.at(-1);
      else if (chapters <= 12) image = HouseLargeX.at(-1);
      else image = HouseLargeExtra.at(-1);
    }



    cityData[index] = {
      type: "house",
      image: image
    };
  }
}
// 

/* ===== CREATE GRID ===== */
function createGrid() {
  grid.style.gridTemplateColumns =`repeat(${size},120px)`
  for (let i = 0; i <size*size; i++) {
      const tile = createTile(cityData[i], i);
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
  if (data && data.type === "house") {
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