let TC = document.querySelector(".ticket-container");
let filter = document.querySelectorAll(".filter");
let visible_modal = false;
let priority_color;

// fetching data from local storage so when we load the data wont disappear
// this is the last step we have done
function loadTickets(color){
    let allTask = localStorage.getItem("allTask");

    if(allTask != null){
        allTask = JSON.parse(allTask);

        if(color){
            allTask = allTask.filter(function(data){
                return data.priority_color == color;
            });
        }
        for(let i=0; i<allTask.length; i++){
            let ticket = document.createElement("div");
            
            ticket.classList.add("ticket");
            ticket.innerHTML = `<div class="ticket-color ticket-${allTask[i].priority_color}"></div>
            <div class="ticket-id">#${allTask[i].ticket_id}</div>
            <div class="ticket-task">${allTask[i].task}</div>`;

            TC.appendChild(ticket);
            ticket.addEventListener("click",function(e){
                if(e.currentTarget.classList.contains("active")){
                    e.currentTarget.classList.remove("active");
                }else{
                    e.currentTarget.classList.add("active");
                }
            });
        }
    }
}
loadTickets();
for(let i=0;i<filter.length;i++){
    filter[i].addEventListener("click",filter_handler);
}

function filter_handler(e){
    TC.innerHTML = "";
    if(e.currentTarget.classList.contains("active")){
        e.currentTarget.classList.remove("active");
        loadTickets();
    }else{
        let act_filter = document.querySelector(".filter.active");
        if(act_filter){
            act_filter.classList.remove("active");
        }
        e.currentTarget.classList.add("active");
        let priorityclr = e.currentTarget.children[0].classList[0].split("-")[0];
        loadTickets(priorityclr);
    }
}

let add_btn = document.querySelector(".add");
let delete_btn = document.querySelector(".delete");

delete_btn.addEventListener("click",function(e){
    let selected_tickets = document.querySelectorAll(".ticket.active");
    let allTask = JSON.parse(localStorage.getItem("allTask"));
    for(let i=0; i<selected_tickets.length; i++){
        selected_tickets[i].remove();
        let ticketID = selected_tickets[i].querySelector(".ticket-id").innerText;
        allTask = allTask.filter(function(data){
            return "#"+data.ticket_id != ticketID;
        })
    }
    localStorage.setItem("allTask",JSON.stringify(allTask));
});

add_btn.addEventListener("click",add_modal);

function add_modal(e){
    if(!visible_modal){
        priority_color = "pink";
        let modal = document.createElement("div");
        modal.classList.add("modal");
        modal.innerHTML = `<div class="task-container" data-typed="false" contenteditable="true">Enter your task here...</div>
                            <div class="modal-priority-list">
                                <div class="modal-pink-filter modal-filter active"></div>
                                <div class="modal-red-filter modal-filter"></div>
                                <div class="modal-blue-filter modal-filter"></div>
                                <div class="modal-green-filter modal-filter"></div>
                            </div>`;
        TC.appendChild(modal);
        let taskModal = document.querySelector(".task-container");
        taskModal.addEventListener("click",function(e){
            if(e.currentTarget.getAttribute("data-typed") == "false"){
                e.currentTarget.innerText = "";
                e.currentTarget.setAttribute("data-typed", "true");
            }
        })
        visible_modal = true;
        taskModal.addEventListener("keypress",addTicket.bind(this,taskModal));
        
        let modal_filter = document.querySelectorAll(".modal-filter");
        for(let i=0;i<modal_filter.length;i++){
            modal_filter[i].addEventListener("click",selectPriority.bind(this,taskModal));
        }
}

   
}

function selectPriority(taskModal,e){
    let active_filter = document.querySelector(".modal-filter.active");
    active_filter.classList.remove("active");
    priority_color = e.currentTarget.classList[0].split("-")[1];
    e.currentTarget.classList.add("active");
    taskModal.click();
    taskModal.focus();
}


function addTicket(taskModal,e){
    if(e.key == "Enter" && e.shiftKey == true && taskModal.innerText.trim() !=""){
        let task = taskModal.innerText;
        // let ticket = document.createElement("div");
        let id = uid();
        // ticket.classList.add("ticket");
        // ticket.innerHTML = `<div class="ticket-color ticket-${priority_color}"></div>
        // <div class="ticket-id">#${id}</div>
        // <div class="ticket-task">${task}</div>`;

        document.querySelector(".modal").remove();
        // TC.appendChild(ticket);
        visible_modal = false;
        // ticket.addEventListener("click",function(e){
        //     if(e.currentTarget.classList.contains("active")){
        //         e.currentTarget.classList.remove("active");
        //     }else{
        //         e.currentTarget.classList.add("active");
        //     }
        // });

        let allTask = localStorage.getItem("allTask");

        if(allTask == null){
            let data = [{"ticket_id":id, "task":task, "priority_color":priority_color}];
            localStorage.setItem("allTask",JSON.stringify(data));
        }else{
            let data = JSON.parse(allTask);
            data.push({"ticket_id":id, "task":task, "priority_color":priority_color});
            localStorage.setItem("allTask",JSON.stringify(data));
        }

        let activeFilter = document.querySelector(".filter.active");
        TC.innerHTML = "";
        if(activeFilter){
            let prtclr = activeFilter.children[0].classList[0].split("-")[0];
            loadTickets(prtclr);
        }else{
            loadTickets();
        }

    }else if(e.key == "Enter" && e.shiftKey == true){
        e.preventDefault();
        alert("You have not typed any data");
    }
}