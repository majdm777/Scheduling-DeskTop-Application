

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
    let days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
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
                this.classList.toggle("active");

                Switch()

                let msge = document.querySelector("#date")
                msge.innerHTML="add course to this date"+ this.dataset.date;


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

