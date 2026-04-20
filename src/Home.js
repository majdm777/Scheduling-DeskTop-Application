let MESSAGE = document.getElementsByClassName("message");
let LIRA=1;

async function loadSchedules() {
    if (!window.api?.getSchedules) {
        MESSAGE.innerHTML="Failed to load Schedule. Please Try To reload The Page"
        return;
    }

    let schedules = await window.api.getSchedules();
    console.log(schedules);

    for(let sch of schedules){
        if(sch.State==="Completed"){
            LIRA=LIRA*1.05;
        }
    }
    document.getElementById("LIRA").innerHTML="LIRA : "+LIRA.toFixed(4);
    document.getElementById("exit").addEventListener("click", () => {window.api.closeApp()});
    displaySchedule(schedules)
}


function displaySchedule(schedules){
    let Container = document.querySelector(".Current_Active_Schedules");
    let CompletedContainer =document.querySelector(".Completed_Schedules")
    Container.innerHTML = '';

    for (let element of schedules) {

        let completion_Bar = element.Number_Of_Courses > 0
        ? (element.completion_Bar / element.Number_Of_Courses) * 100
        : 0;

        let start = new Date(element.start_date);
        let now = new Date();
        let end = new Date(element.end_date);

        start.setHours(0,0,0,0);
        now.setHours(0,0,0,0);
        end.setHours(0,0,0,0);

        let days;

        if (now < start) {
            let day = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
            days = "Starts in " + day + " day(s)";
        } else if (now > end) {
            days = "Completed";
        } else {
            let day = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
            days = day + " day(s) Left";
        }

        let newSchedule = document.createElement("div");
        newSchedule.classList.add("schedule-card");

        newSchedule.innerHTML = `
            <div class="Schedule_info">
                <h1 class="Info_Detail">${element.name}</h1>
                <h3 class="Info_Detail">${days}</h3>
            </div>
            <div class="Schedule_Completion_Bar">
                <div class="progress" style="width: ${completion_Bar}%;"></div>
            </div>
            <div class="date">
                <h3 class="Info_Detail">${element.start_date}</h3>
                <h3 class="Info_Detail">${element.State}</h3>
                <h3 class="Info_Detail">${element.end_date}</h3>
            </div>
        `;

        newSchedule.addEventListener("click", function(){
            window.location.href = `View.html?name=${encodeURIComponent(element.name)}`;
        });

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("deleteButton");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function(e){
            e.stopPropagation(); // 🔥
            window.api.deleteSchedule({
                schedule_name: element.name
            });
            loadSchedules()
        });


        let City= document.createElement("button");
        City.classList.add("deleteButton");
        City.textContent = " View City";

        City.addEventListener("click", function(e){
            e.stopPropagation(); // 🔥
            window.location.href = `City.html?name=${encodeURIComponent(element.name)}&lira=${encodeURIComponent(LIRA)}`
        });

        let rowButton=document.createElement("div")
        rowButton.classList.add("rowButton")
        
        rowButton.appendChild(deleteButton)
        rowButton.appendChild(City)

        newSchedule.appendChild(rowButton);
        

        if(element.State ==="Completed"){
            CompletedContainer.appendChild(newSchedule)
        }else{
            Container.appendChild(newSchedule);
        }
    


    }
    if(Container.innerHTML===""){
        Container.innerHTML=`<h1> No Schedules `
    }
}

function showHideCompletedSchedules(){
    let button = document.querySelector("#hide-completed-schedules")
    let container = document.querySelector("#Completed_Schedules")

    if(button.innerHTML ==="H"){
        button.innerHTML ="S"
        
        
        container.style.display="none" 
    }else{
        button.innerHTML ="H"
        container.style.display="grid" 
    }

}


window.onload = loadSchedules();