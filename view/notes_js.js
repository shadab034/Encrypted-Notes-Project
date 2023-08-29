let add_notes = document.getElementById("addbtn");
/*
setInterval(() => {
    blurr = document.getElementById("blur");
    body_styles = getComputedStyle(document.body);
    body_height = body_styles.getPropertyValue("height");
    body_height_str = body_height.replace("px", "");
    blurr_style = getComputedStyle(blurr);
    blurr_height = blurr_style.getPropertyValue("height");
    blurr_height_str = blurr_height.replace("px", "");
    body_height_str_num = Number(body_height_str);
}, 200);

setInterval(() => {
    current_time = new Date();
    current_year = current_time.getFullYear();
    current_month = current_time.getMonth();
    current_date = current_time.getDate();
    current_hour = current_time.getHours();
    current_min = current_time.getMinutes();
    current_second = current_time.getSeconds();
    
    note_current_years = JSON.parse(localStorage.getItem("years"));
    note_current_dates = JSON.parse(localStorage.getItem("dates"));
    note_current_months = JSON.parse(localStorage.getItem("months"));
    note_current_hours = JSON.parse(localStorage.getItem("hours"));
    note_current_minute = JSON.parse(localStorage.getItem("minutes"));
    note_current_seconds = JSON.parse(localStorage.getItem("seconds"));
    
    Curr_note_year = new Array();
    Curr_note_month = new Array();
    Curr_note_date = new Array();
    Curr_note_hour = new Array();
    Curr_note_minute = new Array();
    Curr_note_second = new Array();

    if (note_current_years == null && 
        note_current_dates == null && note_current_months == null &&
        note_current_hours == null && note_current_minute == null &&
        note_current_seconds == null) 
    {
        Curr_note_year = [];
        Curr_note_month = [];
        Curr_note_date = [];
        Curr_note_hour = [];
        Curr_note_minute = [];
        Curr_note_second = [];
    }
    else
    {
        // Curr_note_year = note_current_years;
        // Curr_note_month = note_current_months;
        // Curr_note_date = note_current_dates;
        // Curr_note_hour = note_current_hours;
        // Curr_note_minute = note_current_minute;
        // Curr_note_second = note_current_seconds;
        
        time_displayelem = new Array(document.getElementsByClassName("time-display"));
        for (let index = 0; index < time_displayelem[0].length; index++) {
            time_displayelem[0][index].innerText = "hi";
        }    
    }

    //let time = current_minute - 
}, 60000)
*/
add_notes.addEventListener('click', function(){
    addtxt = document.getElementById("addtxt");
    note_title_val = document.getElementById("note-title-field").value;
    let notearr = new Array();
    let note_title_arr = new Array();
    note_title = JSON.parse(localStorage.getItem("note-title")); 
    noteobj = JSON.parse(localStorage.getItem("notes"));
    if (noteobj == null || note_title == null) {
        notearr = [];
        note_title_arr = [];
    }
    else{
        notearr = noteobj;
        note_title_arr =  note_title;
    }
    notearr.push(addtxt.value);
    note_title_arr.push(note_title_val);
    localStorage.setItem('notes', JSON.stringify(notearr));
    localStorage.setItem('note-title', JSON.stringify(note_title_arr));
    //time_calculation();    
    displaynotes();
    note_ti = document.getElementById("note-title-field");
    note_ti.value = ""; 
    addtxt.value = "";
    blurr = document.getElementById("blur");
    if (blurr.style.height != "694px") {
        height = document.documentElement.scrollHeight;
        blurr.style.height = height + "px";
    }
    blur_height_adjust()
    repeatedtime_change();
});

function repeatedtime_change(){
    setInterval(() => {
        current_time = new Date();
        current_year = current_time.getFullYear();
        current_month = current_time.getMonth();
        current_date = current_time.getDate();
        current_hour = current_time.getHours();
        current_min = current_time.getMinutes();
        current_second = current_time.getSeconds();
        
        note_created2_years = JSON.parse(localStorage.getItem("years"));
        note_created2_dates = JSON.parse(localStorage.getItem("dates"));
        note_created2_months = JSON.parse(localStorage.getItem("months"));
        note_created2_hours = JSON.parse(localStorage.getItem("hours"));
        note_created2_minute = JSON.parse(localStorage.getItem("minutes"));
        note_created2_seconds = JSON.parse(localStorage.getItem("seconds"));
        
        Curr_note_year = new Array();
        Curr_note_month = new Array();
        Curr_note_date = new Array();
        Curr_note_hour = new Array();
        Curr_note_minute = new Array();
        Curr_note_second = new Array();
    
        if (note_created2_years == null && 
            note_created2_dates == null && note_created2_months == null &&
            note_created2_hours == null && note_created2_minute == null &&
            note_created2_seconds == null) 
        {
            Curr_note_year = [];
            Curr_note_month = [];
            Curr_note_date = [];
            Curr_note_hour = [];
            Curr_note_minute = [];
            Curr_note_second = [];
        }
        else
        {
            for (let index = 0; index < Curr_note_year.length; index++) {
                Curr_note_year[index] = current_year - note_created2_years[index];
                Curr_note_month[index] = current_month - note_created2_months[index];
                Curr_note_date[index] = current_date - note_created2_dates[index];
                Curr_note_hour[index] = current_hour - note_created2_hours[index];
                Curr_note_minute[index] = current_min - note_created2_minute[index];
                Curr_note_second[index] = current_second - note_created2_seconds[index];
            }
            for (let index = 0; index < Curr_note_year.length; index++) {
                time_displayelem = document.getElementsByClassName("time-display");
                if (Curr_note_year[index] == 0) {
                    if (Curr_note_month[index] > 0) {
                        if (Curr_note_date[index] > 0){
                            time_displayelem = document.getElementsByClassName("time-display");
                            if (Cur_note_month[index] == 1) {
                                time_displayelem.innerText = "One month ago";
                            }
                            else{
                                time_displayelem.innerText = Curr_note_month[index] + " months ago";
                            }
                        }
                        if (Curr_note_date[index] == 0) {
                            time_displayelem = document.getElementsByClassName("time-display");
                            if (Curr_note_hour[index] == 0) {
                                if (Curr_note_minute[index] == 0 || Curr_note_minute[index] > 0) {
                                    if (Curr_note_month[index] == 1) {
                                        time_displayelem.innerText = "One month ago";
                                    }
                                    else{
                                        time_displayelem.innerText = Curr_note_month[index] + " months ago";
                                    }
                                }
                            }
                            if (Curr_note_hour[index] > 0){
                                if (Curr_note_month[index] == 1) {
                                    time_displayelem.innerText = "One month ago";
                                }
                                else{
                                    time_displayelem.innerText = Curr_note_month[index] + " months ago";
                                }
                            }
                            if (Curr_note_hour[index] < 0){
                                if (Curr_note_month[index] == 1) {
                                    time_displayelem.innerText = "29 days ago";
                                }
                                else{
                                    if ((Curr_note_month[index] - 1) == 1) {
                                        time_displayelem.innerText = "One month ago";
                                    }
                                    else{
                                        time_displayelem.innerText = (Curr_note_month[index] - 1) + " months ago";
                                    }
                                }
                            }
                        }
                        if (Curr_note_date[index] < 0) {
                            if (Curr_note_hour[index] == 0) {
                                if (Curr_note_minute[index] == 0 || Curr_note_minute[index] > 0) {
                                    time_displayelem.innerText = (Curr_note_date[index] - 30) + " days ago";        
                                }
                                if (Curr_note_minute[index] < 0) {
                                    time_displayelem.innerText = (Curr_note_date[index] - 29) + " days ago";
                                }
                            }
                            if (Curr_note_hour[index] > 0) {
                                time_displayelem.innerText = (Curr_note_date[index] - 30) + " days ago";
                            }
                            if (Curr_note_hour[index] < 0) {
                                time_displayelem.innerText = (Curr_note_date[index] - 29) + " days ago";
                            }
                        }
                    }
                    if (Curr_note_month[index] == 0) {
                        if (Curr_note_date[index] == 0) {
                            time_displayelem = document.getElementsByClassName("time-display");
                            if (Curr_note_hour[index] == 0) {
                                if (Curr_note_minute[index] == 0) {
                                    time_displayelem.innerText = "0 minutes ago";
                                }
                                if (Curr_note_minute[index] > 0) {
                                    if (Curr_note_minute[index] == 1) {
                                        time_displayelem[index].innerText = "One minute ago";    
                                    }
                                    else{
                                        time_displayelem[index].innerText = Curr_note_minute[index] + " minutes ago";
                                    }
                                }
                            }
                            if (Curr_note_hour[index] > 0){
                                if (Curr_note_minute[index] == 0) {
                                    if (Curr_note_second[index] == 0 || Curr_note_second > 0) {
                                        if (Curr_note_hour[index] == 1) {
                                            time_displayelem.innerText = "One hour ago";
                                        }
                                        else{
                                            time_displayelem.innerText = Curr_note_hour[index] + " hours ago";
                                        }
                                    }
                                    if (Curr_note_second[index] < 0) {
                                        if ((Curr_note_hour[index] - 1) == 1) {
                                            time_displayelem.innerText = "One hour ago";
                                        }
                                        else{
                                            time_displayelem.innerText = (Curr_note_hour[index] - 1) + " hours ago";
                                        }
                                    }
                                }
                                if (Curr_note_minute[index] > 0) {
                                    if (Curr_note_hour[index] == 1) {
                                        time_displayelem[index].innerText = "One hour ago";    
                                    }
                                    else{
                                        time_displayelem[index].innerText = Curr_note_hour[index] + " hours ago";
                                    }
                                }
                                if (Curr_note_minute[index] < 0) {
                                    if (Curr_note_hour[index] == 1) {
                                        time_displayelem.innerText = (Curr_note_minute[index] + 60) + " minutes ago";
                                    }
                                    else{
                                        time_displayelem.innerText = (Curr_note_hour[index] - 1) + " hours ago";
                                    }
                                }
                            }
                        }
                        if (Curr_note_date[index] > 0) {
                            time_displayelem = document.getElementsByClassName("time-display");
                            if (Curr_note_date[index] == 1) {
                                if (Curr_note_hour[index] == 0) {
                                    if (Curr_note_minute[index] == 0) {
                                        if (Curr_note_second == 0 || Curr_note_second > 0) {
                                            time_displayelem[index].innerText = "One day ago";
                                        }
                                        if (Curr_note_second < 0) {
                                            time_displayelem[index].innerText = "23 hours ago";
                                        }
                                    }
                                    if (Curr_note_minute[index] > 0) {
                                        time_displayelem[index].innerText = "One day ago";
                                    }
                                    if (Curr_note_minute[index] < 0) {
                                        time_displayelem[index].innerText = "23 hours ago";
                                    }
                                }
                                if (Curr_note_hour[index] > 0){
                                    time_displayelem[index].innerText = "One day ago";
                                }
                                if (Curr_note_hour[index] < 0){
                                    time_displayelem[index].innerText = (Curr_note_hour + 24) + " hours ago";
                                }
                            }
                            else{
                                time_displayelem = document.getElementsByClassName("time-display");
                                if (Curr_note_hour[index] == 0) {
                                    if (Curr_note_minute[index] == 0) {
                                        if (Curr_note_second == 0 || Curr_note_second > 0) {
                                            time_displayelem[index].innerText = Curr_note_date[index] + " days ago";
                                        }
                                        if (Curr_note_second < 0) {
                                            if (Curr_note_date[index] - 1 == 1) {
                                                time_displayelem[index].innerText = "One day ago";    
                                            }
                                            else{
                                                time_displayelem[index].innerText = (Curr_note_date[index] - 1) + " days ago";
                                            }
                                        }
                                    }
                                    if (Curr_note_minute[index] > 0) {
                                        time_displayelem[index].innerText = Curr_note_date[index] + " days ago";
                                    }
                                    if (Curr_note_minute[index] < 0) {
                                        if (Curr_note_date[index] - 1 == 1) {
                                            time_displayelem[index].innerText = "One day ago";    
                                        }
                                        else{
                                            time_displayelem[index].innerText = (Curr_note_date[index] - 1) + " days ago";
                                        }
                                    }
                                }
                                if (Curr_note_hour[index] > 0){
                                    time_displayelem[index].innerText = Curr_note_date[index] + " days ago";
                                }
                                if (Curr_note_hour[index] < 0){
                                    if (Curr_note_date[index] - 1 == 1) {
                                        time_displayelem[index].innerText = "One day ago";    
                                    }
                                    else{
                                        time_displayelem[index].innerText = (Curr_note_date[index] - 1) + " days ago";
                                    }
                                }
                            }
                        }    
                    }
                }
                if (Curr_note_year[index] > 0) {
                    if (Curr_note_year[index] = 1) {
                        if (Curr_note_month[index] == 0) {
                            if (Curr_note_date[index] == 0 || Curr_note_date[index] > 0) {
                                time_displayelem = document.getElementsByClassName("time-display");
                                time_displayelem[index].innerText = "a year ago";
                            }
                            if (Curr_note_date[index] < 0) {
                                time_displayelem = document.getElementsByClassName("time-display");
                                time_displayelem[index].innerText = "11 months ago";
                            }    
                        }
                        if (Curr_note_month[index] < 0) {
                            time_displayelem = document.getElementsByClassName("time-display");
                            let time_gap = Number(Curr_note_month[index]);
                            time_gap = time_gap + 12;
                                if (Curr_note_date[index] == 0 || Curr_note_date[index] > 0) {
                                    if (time_gap == 1) {
                                        time_displayelem[index].innerText = "a month ago";
                                    }
                                    else{
                                        time_displayelem[index].innerText = time_gap + " months ago";
                                    }
                                }
                                if (Curr_note_date[index] < 0) {
                                    if ((time_gap - 1) == 1) {
                                        time_displayelem[index].innerText = "a month ago";
                                    }
                                    else{
                                        time_displayelem[index].innerText = (time_gap - 1) + " months ago";
                                    }
                                }
                        }
                        if (Curr_note_month[index] > 0) {
                            time_displayelem = document.getElementsByClassName("time-display");
                            time_displayelem[index].innerText = "a year ago"; 
                        }
                    }
                    if (Curr_note_year[index] > 1) {
                        if (Curr_note_month[index] == 0) {
                            if (Curr_note_date[index] == 0 || Curr_note_date[index] > 0) {
                                time_displayelem = document.getElementsByClassName("time-display");
                                time_displayelem[index].innerText = Curr_note_year[index] + " years ago";
                            }
                            if (Curr_note_date[index] < 0) {
                                time_displayelem = document.getElementsByClassName("time-display");
                                let year_gap = Curr_note_year[index] - 1;
                                if (year_gap == 1) {
                                    time_displayelem[index].innerText = "a year ago";
                                }
                                else{
                                    time_displayelem[index].innerText = (Curr_note_year[index] - 1) + " years ago";
                                }
                            }    
                        }
                        if (Curr_note_month[index] < 0) {
                            time_displayelem = document.getElementsByClassName("time-display");
                            let year_gap = Curr_note_year[index] - 1;
                            if (year_gap == 1) {
                                time_displayelem[index].innerText = "a year ago";
                            }
                            else{
                                time_displayelem[index].innerText = (Curr_note_year[index] - 1) + " years ago";
                            }
                        }
                        if (Curr_note_month[index] > 0) {
                            time_displayelem = document.getElementsByClassName("time-display");
                            time_displayelem[index].innerText = Curr_note_year[index] + " years ago"; 
                        }
                    }
                }                
                
            }
            // Curr_note_year = note_current_years;
            // Curr_note_month = note_current_months;
            // Curr_note_date = note_current_dates;
            // Curr_note_hour = note_current_hours;
            // Curr_note_minute = note_current_minute;
            // Curr_note_second = note_current_seconds;    
        }
    
        //let time = current_minute - 
    }, 60000);
}

document.addEventListener('click', function(event){
    let del_btn2 = event.target;
    // console.log("1");
    if (del_btn2.id == "delete-btn") {
        // if (document.getElementById("undo-strip") != null) {
            //     document.getElementById("undo-strip").remove;
            // }
            let confirm_prompt = document.getElementById("confirm");
            confirm_prompt.style.display = "flex";
            let blurr = document.getElementById("blur");
            blurr.style.zIndex = "1";
            blurr.style.backgroundColor = "rgba(0, 0, 0, 0.656)";
            
            document.addEventListener('keydown', function(event){
                if (event.key == "Escape") {
                    confirm_prompt.style.display = "none";
                    let blurr = document.getElementById("blur");
                    blurr.style.zIndex = "-1";
                    blurr.style.backgroundColor = "transparent";
                }
            });
            
        let yes_btn = document.getElementById("yes-btn");
        yes_btn.addEventListener('click', function(){
            // console.log("hi");
            confirm_prompt.style.display = "none";
            let blurr = document.getElementById("blur");
            blurr.style.zIndex = "-1";
            blurr.style.backgroundColor = "transparent";
            
            
            note_content = del_btn2.parentElement.children[1].innerText;
            note_title_content = del_btn2.parentElement.children[0].innerText; 
            myobj2 = del_btn2.parentElement.parentElement; 
            myobj2.remove();
            notedel = JSON.parse(localStorage.getItem("notes"));
            note_title_del = JSON.parse(localStorage.getItem("note-title"));
            let note_newarr = new Array();
            let note_title_newarr = new Array(); 
            notedel.forEach(element => {
                if (element != note_content) {
                    note_newarr.push(element);
                }
            });
            note_title_del.forEach(element => {
                if (element != note_title_content) {
                    note_title_newarr.push(element);
                }
            });
            localStorage.setItem('notes', JSON.stringify(note_newarr));
            localStorage.setItem('note-title', JSON.stringify(note_title_newarr));
            blur_height_adjust();
            // undo_bar_show();
        });
        
        let no_btn = document.getElementById("no-btn");
        no_btn.addEventListener('click', function(){
            confirm_prompt.style.display = "none";
            let blurr = document.getElementById("blur");
            blurr.style.zIndex = "-1";
            blurr.style.backgroundColor = "transparent";
        })
    }
});

function time_calculation(){
    date = new Date();
    created_year = date.getFullYear();
    created_month = date.getMonth();
    created_date = date.getDate();
    created_hour = date.getHours();
    created_min = date.getMinutes();
    created_second = date.getSeconds();
    
    note_created_years = JSON.parse(localStorage.getItem("years"));
    note_created_dates = JSON.parse(localStorage.getItem("dates"));
    note_created_months = JSON.parse(localStorage.getItem("months"));
    note_created_hours = JSON.parse(localStorage.getItem("hours"));
    note_created_minute = JSON.parse(localStorage.getItem("minutes"));
    note_created_seconds = JSON.parse(localStorage.getItem("seconds"));
    
    note_year = new Array();
    note_month = new Array();
    note_date = new Array();
    note_hour = new Array();
    note_minute = new Array();
    note_second = new Array();
    
    if (note_created_years == null && 
        note_created_dates == null && note_created_months == null &&
        note_created_hours == null && note_created_minute == null &&
        note_created_seconds == null) {
            note_year = [];
            note_month = [];
            note_date = [];
            note_hour = [];
            note_minute = [];
            note_second = [];
    }
    else{
            note_year = note_created_years;
            note_month = note_created_months;
            note_date = note_created_dates;
            note_hour = note_created_hours;
            note_minute = note_created_minute;
            note_second = note_created_seconds;
    }

    note_year.push(created_year);
    note_month.push(created_month);
    note_date.push(created_date);
    note_hour.push(created_hour);
    note_minute.push(created_min);
    note_second.push(created_second);
    
    localStorage.setItem('years', JSON.stringify(note_year));
    localStorage.setItem('months', JSON.stringify(note_month));
    localStorage.setItem('dates', JSON.stringify(note_date));
    localStorage.setItem('hours', JSON.stringify(note_hour));
    localStorage.setItem('minutes', JSON.stringify(note_minute));
    localStorage.setItem('seconds', JSON.stringify(note_second));
}

function displaynotes(){ 
    //created_note_time = 0;
    notesdisplay_parent = document.getElementById("notes");
    created_box = document.createElement('div');
    created_box_body = document.createElement('div');
    box_title = document.createElement("h5");
    box_content = document.createElement("p");
    box_delbtn = document.createElement("button");
    //notecreated_time = document.createElement("p");
    box_content.innerText = addtxt.value; 
    box_title.innerText = note_title_val;
    //notecreated_time.innerText = created_note_time + " minute ago";
    box_delbtn.innerText = "Delete Note";
    created_box.style.width = "18rem";
    //notecreated_time.classList.add("time-display");
    created_box.classList.add("noteCard", "my-2", "mx-2", "card")
    created_box_body.classList.add("card-body");
    box_title.class = "card-title";
    box_content.class = "card-text";
    box_delbtn.classList.add("btn", "btn-primary");
    box_delbtn.id = "delete-btn";
    notesdisplay_parent.appendChild(created_box);
    created_box.appendChild(created_box_body);
    created_box_body.appendChild(box_title);
    created_box_body.appendChild(box_content);
    created_box_body.appendChild(box_delbtn);
    created_box_body.appendChild(notecreated_time);
};



function blur_height_adjust(){
    blurr = document.getElementById("blur");
    body_styles2 = getComputedStyle(document.body);
    body_height2 = body_styles2.getPropertyValue("height");
    body_height2_str = body_height2.replace("px", "");
    body_height2_str_num = Number(body_height2_str);
    if (blurr.style.height != "694px") {
        height = document.documentElement.scrollHeight;
        blurr.style.height = height + "px";
    }
    window.location.reload();
    if (body_height_str - body_height2_str_num != 0) {
        blurr.style.height = body_height2_str_num + 16 + "px";
        // window.location.reload();
        // if (body_height2_str == 598) {
        //     blurr.style.height = body_height2_str + 16 + "px";
        //     console.log("hi");
        //     console.log(body_height2_str);
        // }
    }
}

// function undo_bar_show(){
    // undo_bar = document.createElement("div");
    // bar_content = document.createElement("span");
    // undo_btn = document.createElement("span");
    // undo_bar.classList.add("undo-bar")
    // undo_bar.id = "undo-strip";
    // bar_content.classList.add("content");
    // undo_btn.classList.add("undo-btn");
    // undo_btn.id = "undo"
    // setTimeout(() => {
    //     bar_content.innerText = "Note Deleted";
    //     undo_btn.innerText = "Undo";
    // }, 240);
    // document.getElementById("note-body").appendChild(undo_bar);
    // undo_bar.appendChild(bar_content);
    // undo_bar.appendChild(undo_btn);
    // setTimeout(() => {
        // undo_bar.remove();
    // }, 3000);
    
    // undo_btn.addEventListener('click', function(){
    //     localStorage.setItem('notes', JSON.stringify(notedel));
    //     undo_bar.remove();
    //     location.reload();    
    // });
// };

window.onload = function notecardisplay(){
    let index = 0;
    notearr2 = new Array();
    note_title_arr2 = new Array();
    noteobj2 = JSON.parse(localStorage.getItem("notes")); 
    note_title_obj = JSON.parse(localStorage.getItem("note-title"));
    if (noteobj2 == null || note_title_obj == null) {
        notearr2 = []
        note_title_arr2 = []; 
    }
    else{
        notearr2 = noteobj2;
        note_title_arr2 = note_title_obj;
    }
    for (previous_noteval of notearr2) {
        note_title_val = document.getElementById("note-title-field");
        notesdisplay_parent = document.getElementById("notes");
        created_box = document.createElement('div');
        created_box_body = document.createElement('div');
        box_title = document.createElement("h5");
        box_content = document.createElement("p");
        box_delbtn = document.createElement("button");
        //notecreated_time = document.createElement("p");
        box_content.innerText = previous_noteval;
        //notecreated_time.innerText = "Created X mins ago.";
        box_delbtn.innerText = "Delete Note";
        created_box.style.width = "18rem";
        created_box.classList.add("noteCard", "my-2", "mx-2", "card")
        created_box_body.classList.add("card-body");
        box_title.class = "card-title";
        box_title.id = "note-title";
        box_content.class = "card-text";
        //notecreated_time.classList.add("time-display");
        for (iteration = 0; iteration < 1; iteration++, index++) {
            box_title.innerText = note_title_arr2[index];
        }
        box_delbtn.classList.add("btn", "btn-primary");
        box_delbtn.id = "delete-btn";
        notesdisplay_parent.appendChild(created_box);
        created_box.appendChild(created_box_body);
        created_box_body.appendChild(box_title);
        created_box_body.appendChild(box_content);
        created_box_body.appendChild(box_delbtn);
        //created_box_body.appendChild(notecreated_time);
        blurr = document.getElementById("blur");
        if (blurr.style.height != "694px") {
            height = document.documentElement.scrollHeight;
            blurr.style.height = height + "px";
        }
    }   
}