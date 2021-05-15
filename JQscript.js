let TC = $(".ticket-container");
let visible_modal = false;
let priority_color;

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
            let ticket = $("<div></div>").addClass("ticket").html(`<div class="ticket-color ticket-${allTask[i].priority_color}"></div>
                                                                <div class="ticket-id">#${allTask[i].ticket_id}</div>
                                                                <div class="ticket-task">${allTask[i].task}</div>`);
            TC.append(ticket);
            ticket.click(function(){
                $(this).toggleClass("active");
            });
        }
    }
}

loadTickets();

$(".filter").click(filter_handler);

function filter_handler(){
    TC.html("");
    let fltrclass = $(this).attr("class").split(" ");
    if(fltrclass[fltrclass.length - 1] == "active"){
        $(this).removeClass("active");
        loadTickets();
    }else{
        $(".filter.active").toggleClass("active");
        $(this).toggleClass("active");
        let prtclr = $(this).children("span").attr("class").split("-")[0];
        loadTickets(prtclr);
    }
}

$(".add").click(add_modal);

function add_modal(){
    if(!visible_modal){
        priority_color = "pink";
        let modal = $("<div></div>").addClass("modal").html(`<div class="task-container" data-typed="false" contenteditable="true">Enter your task here...</div>
                    <div class="modal-priority-list">
                        <div class="modal-pink-filter modal-filter active"></div>
                        <div class="modal-red-filter modal-filter"></div>
                        <div class="modal-blue-filter modal-filter"></div>
                        <div class="modal-green-filter modal-filter"></div>
                    </div>`);
        TC.append(modal);

        $(".task-container").click(function(){
            if($(this).attr("data-typed") == "false"){
                $(this).text(""); 
                $(this).attr("data-typed","true");
            }
        })
        visible_modal=true;

        $(".task-container").keypress(addTicket);
        $(".modal-filter").click(selectPriority);
    }
}

function addTicket(e){
    if(e.key == "Enter" && e.shiftKey == true && $(this).text().trim() !=""){
        let task = $(this).text();
        let id = uid();

        // let ticket = $("<div></div>").addClass("ticket").html(`<div class="ticket-color ticket-${priority_color}"></div>
        //                                                         <div class="ticket-id">#${id}</div>
        //                                                         <div class="ticket-task">${task}</div>`);
        // TC.append(ticket);
        $(".modal").remove();
        visible_modal = false;
        // ticket.click(function(){
        //     $(this).toggleClass("active");
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

        TC.html("");
        let active = $(".filter.active"); 
        console.log(active);
        if(active.length !=0 ){
            loadTickets($(".filter.active").children("span").attr("class").split("-")[0]);
        }else{
            loadTickets();
        }
    }else if(e.key == "Enter" && e.shiftKey == true){
        e.preventDefault();
        alert("you may have not typed any data");
    }
}

function selectPriority(e){
    $(".modal-filter.active").toggleClass("active");
    $(this).toggleClass("active");
    priority_color = $(".modal-filter.active").attr("class").split(" ")[0].split("-")[1];
    $(".task-container").focus();
    $(".task-container").click();
}

$(".delete").click(function(e){
    let ids = $(".ticket.active").children(".ticket-id").text().split("#");
    $(".ticket.active").remove();
    let allTask = localStorage.getItem("allTask");
    allTask = JSON.parse(allTask);
    for(let i=1; i<ids.length; i++){
        allTask = allTask.filter(function(data){
            return data.ticket_id != ids[i];
        });
    }
    localStorage.setItem("allTask",JSON.stringify(allTask));
});