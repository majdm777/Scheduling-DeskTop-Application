
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
    let DEFAULT_DATE =SCHEDULE.start_date;
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
    LoadTable()
    addcourse()
});

function LoadTable(){

    console.log("building")

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

                _Building_Level = ASSIGNED_CHAPTERS[_index].Count

                td.innerHTML=formatted;
                if (currentDate > date) {

                    td.classList.add("TableData_NotIncluded");
                } 
                
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






