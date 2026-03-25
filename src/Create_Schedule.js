let NUMBER_OF_DAYS=0
let SCHEDULE_NAME;
let CHAPTERS_PER_DATE=[];
let START_DATE;
let END_DATE
let COURSES = [];
let CHAPTERS=[];

let DEFAULT_DATE;

function navigator(){
    validate_input();
    Switch()
}

function validate_input(){

    COURSES = []
    CHAPTERS=[]
    CHAPTERS_PER_DATE=[]
    let Name = document.querySelector("#Schedule_Name").value 
    let start_date=document.querySelector("#Start_Date").value
    let end_date=document.querySelector("#End_Date").value
    let message=document.querySelector(".Msge")

    if (Name === "" || start_date === "" || end_date === "") {
        message.innerHTML = "Fill all the inputs";
        return;
    }
    SCHEDULE_NAME=Name;
    let start = new Date(start_date)
    let end = new Date(end_date)
    // start.setHours(0,0,0,0)
    // end.setHours(0,0,0,0)

    if(start>end){
        message.innerHTML=" the start date shoud be before the end date"
    }

    if(start == end){
        message.innerHTML="the diff between the dates is not enough to create schedule "
    }
    let days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))+1;
    if(days <=1){message.innerHTML="the diff between the dates is not enough to create schedule "}
    message.innerHTML= days+" days left"

    //set the global variables
    NUMBER_OF_DAYS=days
    START_DATE=start
    END_DATE=end
    //set the default date to the first date of the schedule
    DEFAULT_DATE = START_DATE.toISOString().split("T")[0];

    //set the CHAPTERS_PER_DATE array 
    let temp_date = new Date(start_date)
    for(let i=0;i<days;i++){
        CHAPTERS_PER_DATE.push({
            _DATE:temp_date.toISOString().split("T")[0],
            _Number_Of_Chapters: 0

        })
        temp_date.setDate(temp_date.getDate()+1)
        
    }
    
    CreateSchedule()
}


function CreateSchedule() {

    let table = document.querySelector(".schedule");
    table.innerHTML = "";
    let days = Math.ceil((END_DATE - START_DATE) / (1000 * 60 * 60 * 24))+1
    let size = Math.ceil(Math.sqrt(days));
    let count = 0;

    let date = new Date(START_DATE);
    let currentDate = new Date();
    currentDate.setHours(0,0,0);
    
    let _index_Date=0;

    for (let i = 0; i < size; i++) {
        let tr = document.createElement("tr");

        for (let j = 0; j < size; j++) {
            let td = document.createElement("td");
            td.classList.add("TableData");
            let formatted = (date.getMonth() + 1) + "/" + date.getDate();
            let _Building_Level = -1
            let _Date=CHAPTERS_PER_DATE[_index_Date]

            if (count < days) {
                // set wallpaper according to the level(number of chapters assigned to this date.)
                _Building_Level=_Date._Number_Of_Chapters;


                // format date string        
                td.innerHTML = formatted;


                

                if (currentDate > date) {
                    td.classList.add("TableData_NotIncluded");
                }
                // onclick
                td.addEventListener("click", function () {
                DEFAULT_DATE=this.dataset.date;
                openPopup()
                });

                _index_Date++;
                count++;
            } else {
                td.innerHTML = formatted;
                td.classList.add("TableData_NotIncluded");

            }




            if(_Building_Level===0){
                td.style.backgroundImage="url('building_icons/planing.png')"
            }else if(_Building_Level<0){
                td.style.backgroundImage="url('building_icons/barrier.png')"                
            }else if(_Building_Level<=2){
                td.style.backgroundImage="url('building_icons/blocks_low_level.png')"
            }else if(_Building_Level<=3){
                td.style.backgroundImage="url('building_icons/blocks_middle_level.png')"
            }else if(_Building_Level<=4){
                td.style.backgroundImage="url('building_icons/blocks_high_level.png')"                
            }else{
                td.style.backgroundImage="url('building_icons/barrier.png')"
            }


            // click event

            td.dataset.date = date.toISOString().split("T")[0];
            date.setDate(date.getDate() + 1);
            // store date safely
            

            tr.appendChild(td);
        }

        table.appendChild(tr);
        
    }
    console.log(CHAPTERS_PER_DATE)
}

function openPopup() {
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("courseName").value = "";
    document.getElementById("chaptersContainer").innerHTML = "";
    document.getElementById("popup").style.display = "none";
}

function addChapter() {
    let container = document.getElementById("chaptersContainer");
    let name=document.getElementById("courseName")

    if(name.value.trim()==""){
        alert("enter course name")
        return
    }
    let inputs = document.querySelectorAll("#chaptersContainer input[type='text']");
    
    
    inputs.forEach(input => {
        if (input.value.trim() == "") {
            alert("fill all inputs first")
            inputs.remove()
            return
        }
    });
    let InputsDate =document.querySelectorAll("#chaptersContainer input[type='date']")
    for (let input of InputsDate) {

        if (input.value === "") {
            alert("date is required");
            return;
        }

        let inputDate = new Date(input.value);
        inputDate.setHours(0,0,0,0);

        if (inputDate > END_DATE || inputDate < START_DATE) {
            alert("the date is invalid");
            return;
        }
    }


    let newChapter= document.createElement("div")
    newChapter.classList.add("Chapter_Info")
    let nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "Chapter_Name";

    let dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.className = "Chapter_date";
    dateInput.value=DEFAULT_DATE;


    newChapter.appendChild(nameInput);
    newChapter.appendChild(dateInput);
    container.appendChild(newChapter);
    

}


function saveCourse() {
    let courseName = document.getElementById("courseName").value;

    let chapters = [];

    let chapterDivs = document.querySelectorAll(".Chapter_Info");

    chapterDivs.forEach(div => {
        let name = div.querySelector(".Chapter_Name").value;
        let date = div.querySelector(".Chapter_date").value;

        if (name && date) {
            chapters.push({ name, date });
            CHAPTERS.push({
                Name : name,
                Date: date,
                forCourse:courseName
            })

        }
    });

    chapters.forEach(ch => {
        let assigned = CHAPTERS_PER_DATE.find(n => n._DATE === ch.date);
        if (assigned) assigned._Number_Of_Chapters++;
    });

    console.log(CHAPTERS)

    // TODO: save to SQLite later
    
    let number_of_chapters=chapters.length

    // add course to the global array if not already existed
    let isExisted=COURSES.find(c => c.name.toLowerCase() === courseName.trim().toLowerCase());
    if(isExisted){
        //
        isExisted.number_of_chapters+=chapters.length
    }else{
        // new course
        COURSES.push({
        name: courseName.trim(),
        number_of_chapters: number_of_chapters
        })
    }
    console.log(COURSES)

    document.getElementById("courseName").value = "";
    document.getElementById("chaptersContainer").innerHTML = "";

    addcourse()
    CreateSchedule();
    closePopup();
}

// add course to the course container

function addcourse() {

    let container = document.querySelector(".Course_Container");
    container.innerHTML=""


    COURSES.forEach(course =>{
        if(course.number_of_chapters>0){
            let newCourse = document.createElement("div");
            newCourse.classList.add("Course_Card");

            // header
            let header = document.createElement("div");
            header.classList.add("Course_Name");
            header.innerHTML = `
                <h3>${course.name}</h3>
                <p>0/${course.number_of_chapters}</p>
            `;
            newCourse.appendChild(header); 
            let count =1
            CHAPTERS.forEach(chapter =>{
                if(chapter.forCourse===course.name){
                        let chapterDiv = document.createElement("div");
                        chapterDiv.classList.add("Chapter_Name");

                        let chapterInfo= document.createElement("p")
                        chapterInfo.textContent=`chapter-${count} ${chapter.Name} (${chapter.Date})`

                        let  Cancel_Button = document.createElement("p")
                        Cancel_Button.classList.add("Chapter_Cancel_Button")

                        //might change later
                        Cancel_Button.textContent="X"

                        Cancel_Button.addEventListener("click",function(){
                            CHAPTERS = CHAPTERS.filter(ch => 
                                !(ch.Name === chapter.Name && ch.Date === chapter.Date && ch.forCourse === course.name)
                            );
                            let temp = CHAPTERS_PER_DATE.find(nb => nb._DATE === chapter.Date)
                            temp._Number_Of_Chapters--;
                            let tempcou= COURSES.find(co=> co.name === course.name)
                            tempcou.number_of_chapters--;

                            CreateSchedule();
                            addcourse();
                        })

                        chapterDiv.appendChild(chapterInfo)
                        chapterDiv.appendChild(Cancel_Button)

                        newCourse.appendChild(chapterDiv);
                        count++

                }
            })
            container.appendChild(newCourse);  
        }             
    })

    
}

function Switch() {
    let schedule = document.querySelector(".Schedule_Info");
    let course = document.querySelector(".Course_Info");

    if (schedule.style.display !== "none") {
        schedule.style.display = "none";
        course.style.display = "flex";
    } else {
        schedule.style.display = "flex";
        course.style.display = "none";
    }
}

