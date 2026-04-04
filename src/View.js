
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


async function loadInfo() {
    let MESSAGE = document.querySelector(".Msge")
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
    let NUMBER_OF_DAYS = ASSIGNED_CHAPTERS.length;

    console.log(SCHEDULE)
    console.log(COURSES)
    console.log(CHAPTERS)
    console.log(ASSIGNED_CHAPTERS)

    
    return true ;
}

loadInfo().then(result => {
    if (!result) {
        document.querySelector(".Msge").innerHTML = "failed";
    }
    

    if(!updateData()) alert("Failed To Update The Date");
    updateData();

    LoadTable()
    addcourse()
    loadTodaysTask()
});


// update later?
function updateData(){
    let currentDate = new Date()
    currentDate.setHours(0,0,0,0);

    for(let chapter of CHAPTERS){
        let ch_date=new Date(chapter.date);
        ch_date.setHours(0,0,0,0);
        if(chapter.State==="Chapter Missed" || currentDate > ch_date){
            if(chapter.State !== "Completed"){
                chapter.State = "Chapter Missed";
            }
        }

    }

    return true
}




function LoadTable(){

    // console.log("building")

    let table = document.querySelector(".schedule")
    table.innerHTML='';

    let currentDate = new Date()  // current Date
    currentDate.setHours(0,0,0,0); 

    let _index = 0; // index to count number of days 

    let date = new Date(SCHEDULE.start_date); 

    let start = new Date(SCHEDULE.start_date);
    let end = new Date(SCHEDULE.end_date);

    let days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    let Table_Size = Math.ceil(Math.sqrt(days));

    
    

    for(let i=0;i<Table_Size;i++){

        let tr =document.createElement('tr');
        
        for(let j=0;j<Table_Size;j++){
            let _Building_Level = -1
            let td = document.createElement("td");
            td.classList.add("TableData");

            let formatted = (date.getMonth() + 1) + "/" + date.getDate();

            if(_index < days){

                td.dataset.date = date.toISOString().split("T")[0];

                let _temp_date = date.toISOString().split("T")[0];
                let _assigned_chapter =ASSIGNED_CHAPTERS.find(ch => ch.DATE === _temp_date)

                if(_assigned_chapter) _Building_Level=_assigned_chapter.Count;
                else _Building_Level = 0;

                td.innerHTML=formatted;
                if (currentDate > date) {

                    td.classList.add("TableData_NotIncluded");
                } 

                td.addEventListener("mousemove", function (e) {
                    let tooltip = document.getElementById("tooltip");

                    let date = this.dataset.date;

                    // get chapters for this date
                    let chaptersForDate = CHAPTERS.filter(ch => ch.date === date);

                    if (chaptersForDate.length === 0) {
                        // tooltip.style.display = "none";  // optional
                        tooltip.style.left = (e.clientX + 15) + "px";
                        tooltip.style.top = (e.clientY + 15) + "px";
                        tooltip.style.display = "block";

                        tooltip.innerHTML=`<h3 style=" color:black">No Tasks For Today</h3>` 
                        return;
                    }


                    // build content
                    tooltip.innerHTML =`<h1 style="color:black">Today's Task</h1><br>`+ chaptersForDate
                        .map(ch => `${ch.ForCourse} - ${ch.name}`)
                        .join("<br>");

                    // position near cursor
                    tooltip.style.left = (e.clientX + 15) + "px";
                    tooltip.style.top = (e.clientY + 15) + "px";

                    tooltip.style.display = "block";
                });

                td.addEventListener("mouseleave", function () {
                    document.getElementById("tooltip").style.display = "none";
                });                
                
                _index++;
            }else{
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
            }else if(_Building_Level>3){
                td.style.backgroundImage="url('building_icons/blocks_high_level.png')"                
            }else{
                td.style.backgroundImage="url('building_icons/barrier.png')"
            }

            date.setDate(date.getDate() + 1);

            tr.appendChild(td)

        }
        table.appendChild(tr)
    }

}


function addcourse() {

    let container = document.querySelector(".Course_Container");
    container.innerHTML=""


    COURSES.forEach(course =>{
        if(course.Number_Of_Chapters>0){
            let newCourse = document.createElement("div");
            newCourse.classList.add("Course_Card");

            // header
            let header = document.createElement("div");
            header.classList.add("Course_Name");
            header.innerHTML = `
                <h3>${course.name}</h3>
                <p>${course.Number_Of_Completed_Chapters}/${course.Number_Of_Chapters}</p>
            `;
            newCourse.appendChild(header); 
            let count =1
            CHAPTERS.forEach(chapter =>{
                if(chapter.ForCourse===course.name){
                        let chapterDiv = document.createElement("div");
                        chapterDiv.classList.add("Chapter_Name");

                        let chapterInfo= document.createElement("p")
                        chapterInfo.textContent=`chapter-${count} ${chapter.name} (${chapter.date})`

                        let  Cancel_Button = document.createElement("p")
                        Cancel_Button.classList.add("Chapter_Cancel_Button");


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

function loadTodaysTask(){
    let container = document.querySelector(".Tasks");
    container.innerHTML = "";

    let todaysDate = new Date();
    let _Date_format = todaysDate.toISOString().split("T")[0];

    if (CHAPTERS.length === 0) {
        container.innerHTML = "No Task For Today";
        return;
    }
    
    for (let chapter of CHAPTERS) {
        
        
        if (chapter.date === _Date_format) {

            let chapterTask = document.createElement("div");
            chapterTask.classList.add("TaskInfo");

            chapterTask.innerHTML = `${chapter.ForCourse} - ${chapter.name}`;

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";

            if (chapter.State === "Completed") {
                checkbox.checked = true;
            }

            checkbox.addEventListener("change", function () {
                let course = COURSES.find(co => 
                    co.name === chapter.ForCourse && 
                    co.schedule_Name === chapter.ForSchedule
                );
                

                if (checkbox.checked) {
                    chapter.State="Completed"
                    if(course.Number_Of_Completed_Chapters !== course.Number_Of_Chapters) course.Number_Of_Completed_Chapters++
                    if(course.Number_Of_Completed_Chapters === course.Number_Of_Chapters){
                        course.State = "Completed"   
                    } 
                    SCHEDULE.completion_Bar++  
                    if(SCHEDULE.completion_Bar===SCHEDULE.Number_Of_Courses)  SCHEDULE.State = "Completed"
                } else {
                    chapter.State="Not Completed"
                    if(course.Number_Of_Completed_Chapters!==0) course.Number_Of_Completed_Chapters--
                    if(course.State=== "Completed"){
                        course.State = " Not Completed"
                        
                    }

                    SCHEDULE.completion_Bar--
                    if(SCHEDULE.State === "Completed") SCHEDULE.State="Not Completed";
                }
                

            });

            chapterTask.appendChild(checkbox);
            container.appendChild(chapterTask);
        }
    }
    if(container.innerHTML === "")container.innerHTML="No Tasks For Today"
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

    window.location.href="Home.html"
}

