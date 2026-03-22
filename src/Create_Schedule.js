

function validate_input(){
    let Name = document.querySelector("#Schedule_Name").value 
    let start_date=document.querySelector("#Start_Date").value
    let end_date=document.querySelector("#End_Date").value
    let message=document.querySelector(".Msge")

    if (Name === "" || start_date === "" || end_date === "") {
        message.innerHTML = "Fill all the inputs";
        return;
    }
    let start = new Date(start_date)
    let end = new Date(end_date)
    start.setHours(0,0,0,0)
    end.setHours(0,0,0,0)

    if(start>end){
        message.innerHTML=" the start date shoud be before the end date"
    }

    if(start == end){
        message.innerHTML="the diff between the dates is not enough to create schedule "
    }
    let days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))+1;
    if(days <=1){message.innerHTML="the diff between the dates is not enough to create schedule "}
    message.innerHTML= days+" days left"
    
    CreateSchedule(days,start)
}


function CreateSchedule(days, start) {
    let table = document.querySelector(".schedule");
    table.innerHTML = "";

    let size = Math.ceil(Math.sqrt(days));
    let count = 0;

    let date = new Date(start);
    let currentDate = new Date();
    currentDate.setHours(0,0,0,0);

    for (let i = 0; i < size; i++) {
        let tr = document.createElement("tr");

        for (let j = 0; j < size; j++) {
            let td = document.createElement("td");
            td.classList.add("TableData");

            if (count < days) {

                // format date string
                let formatted = (date.getMonth() + 1) + "/" + date.getDate();
                td.innerHTML = formatted;

                // store date safely
                td.dataset.date = +(date.getMonth()+1)+"/"+date.getDate();

                if (currentDate > date) {
                    td.classList.add("TableData_NotIncluded");
                }
                td.addEventListener("click", function () {
                // console.log("Clicked date:", this.dataset.date);
                openPopup()


                });


                count++;
            } else {
                td.innerHTML = +(date.getMonth()+1)+"/"+date.getDate();
                td.classList.add("TableData_NotIncluded");

            }


            // click event


            date.setDate(date.getDate() + 1);
            tr.appendChild(td);
        }

        table.appendChild(tr);
        
    }
    Switch()
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


    let newChapter= document.createElement("div")
    newChapter.classList.add("Chapter_Info")
    newChapter.innerHTML=`<input type="text" class="Chapter_Name"><input type="date" class="Chapter_date">`
    

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
    }
    });

    console.log("Course:", courseName);
    console.log("Chapters:", chapters);

    // TODO: save to SQLite later
    addcourse(courseName,chapters)

    document.getElementById("courseName").value = "";
    document.getElementById("chaptersContainer").innerHTML = "";

    closePopup();
}

// add course to the course container

function addcourse(courseName, Chapters) {

    let container = document.querySelector(".Course_Container");

    let newCourse = document.createElement("div");
    newCourse.classList.add("Course_Card");

    // header
    let header = document.createElement("div");
    header.classList.add("Course_Name");
    header.innerHTML = `
        <h3>${courseName}</h3>
        <p>0/${Chapters.length}</p>
    `;

    newCourse.appendChild(header);

    // chapters
    let count = 1;

    Chapters.forEach(chapter => {
        let chapterDiv = document.createElement("div");
        chapterDiv.classList.add("Chapter_Name");

        chapterDiv.innerHTML = `
            <p>chapter-${count} ${chapter.name} (${chapter.date})</p>
            <input type="checkbox">
        `;

        newCourse.appendChild(chapterDiv);
        count++
    });

    container.appendChild(newCourse);
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

