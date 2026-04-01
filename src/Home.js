let MESSAGE = document.getElementsByClassName("message");


async function loadSchedules() {
    if (!window.api?.getSchedules) {
        MESSAGE.innerHTML="Failed to load Schedule. Please Try To reload The Page"
        return;
    }

    let schedules = await window.api.getSchedules();
    console.log(schedules);
    displaySchedule(schedules)
}


function displaySchedule(schedules){
    let Container =document.querySelector(".Current_Active_Schedules")
    for(let element of schedules) {
        let completion_Bar = (element.completion_Bar/element.Number_Of_Courses)*100;

        let start = new Date(element.start_date);
        start.setHours(0,0,0,0)
        let now = new Date()
        now.setHours(0,0,0,0);
        let end = new Date(element.end_date);
        end.setHours(0,0,0,0)
        let days
        if(now < start){
            let diff = start - now;
            let day = Math.ceil(diff / (1000 * 60 * 60 * 24)) ;
            days ="Starts in "+day+" day(s)"
        }else{
            let diff = end - now;
            let day = Math.ceil(diff / (1000 * 60 * 60 * 24)) ;
            days = day+" day(s) Left"

        }


        console.log(days); // result
``
        let newSchedule = document.createElement("div")
        newSchedule.classList.add("schedule-card")

        newSchedule.innerHTML=`<div class="Schedule_info">
                                    <h1 id="SCH_NAME" class="Info_Detail">${element.name}</h1>
                                    <h3 id="DAYS_LEFT" class="Info_Detail">${days}</h3>
                                </div>
                                <div class="Schedule_Completion_Bar">
                                    <div class="progress" style="width: ${completion_Bar}%;"></div>
                                </div>
                                <div class="date">
                                    <h3 id="START_DATE" class="Info_Detail">${element.start_date}</h3>
                                    <h3 class="Info_Detail" id="State">${element.State}</h3>
                                    <h3 id="END_DATE" class="Info_Detail">${element.end_date}</h3>
                                </div>`
        newSchedule.addEventListener("click", function(){
            window.location.href=`View.html?name=${encodeURIComponent(element.name)}`
        })
        Container.appendChild(newSchedule)
        
    };


}

window.onload = loadSchedules();