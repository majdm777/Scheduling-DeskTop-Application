let MESSAGE = document.getElementsByClassName("message");


async function loadSchedules() {
    if (!window.api?.getSchedules) {
        MESSAGE.innerHTML="Failed to load Schedule. Please Try Teload The Page"
        return;
    }

    let schedules = await window.api.getSchedules();
    console.log(schedules);
    displaySchedule(schedules)
}


function displaySchedule(schedules){
    let Container =document.querySelector(".Current_Active_Schedules")
    for(let element of schedules) {
        let start = new Date(element.start_date);
        let end = new Date(element.end_date);

        let diff = end - start;
        let days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
        console.log(days); // result

        let newSchedule = document.createElement("div")
        newSchedule.classList.add("schedule-card")

        newSchedule.innerHTML=`<div class="Schedule_info">
                                    <h1 id="SCH_NAME" class="Info_Detail">${element.name}</h1>
                                    <h3 id="DAYS_LEFT" class="Info_Detail">${days} days left</h3>
                                </div>
                                <div class="Schedule_Completion_Bar">
                                    <div class="progress" style="width: ${element.completion_Bar}%;"></div>
                                </div>
                                <div class="date">
                                    <h3 id="START_DATE" class="Info_Detail">${element.start_date}</h3>
                                    <h3 class="Info_Detail" id="State">${element.State}</h3>
                                    <h3 id="END_DATE" class="Info_Detail">${element.end_date}</h3>
                                </div>`
        
        Container.appendChild(newSchedule)
        
    };


}

window.onload = loadSchedules();