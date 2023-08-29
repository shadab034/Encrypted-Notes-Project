const card_display_section = document.getElementById("main-section-right");
const card_display_block = document.getElementById("card-display-block");
card_display_section.scrollTo(0,0);
card_display_block.scrollTo(0,0);

let notecards = [];
let notecards2 = [];
let notecards3 = [];
let from_search_date = document.getElementById("from-search-date");
let to_search_date = document.getElementById("to-search-date");

from_search_date.addEventListener('change', () => {
  var to_min = from_search_date.value.split('"')[0];
  to_search_date.value = "";
  to_search_date.setAttribute('min', to_min);
})

document.getElementById("search-notebtn").addEventListener('click', () => {
  let search_title = document.getElementById("search-title");
  let search_description = document.getElementById("search-description");
  let user_id = document.getElementById("user-id").innerText;
  user_id = user_id.slice(5, user_id.length);
  if(search_title.value === "" 
      && search_description.value === "" && from_search_date.value === ""
      && to_search_date.value === "") return;
  // if(from_date)
  if(from_search_date.value === '' && to_search_date.value !== ''){
    to_search_date.value = '';
    return;
  }
  if(from_search_date.value !== '' && to_search_date.value === ''){
    from_search_date.value = '';
    return;
  }
  document.getElementById("loading-design").style.display = "block";
  document.getElementById("loading-text").innerHTML = "NOW LOADING...";
  let uri =  (search_title.value !== "" && search_description.value !== "")?
              `/api/v1/notes/search/${user_id}/?title=${search_title.value}&description=${search_description.value}&from_date=${from_search_date.value}&to_date=${to_search_date.value}` :
                (search_title.value === "" && search_description.value !== "")?
                `/api/v1/notes/search/${user_id}/?description=${search_description.value}&from_date=${from_search_date.value}&to_date=${to_search_date.value}`:
                  (search_title.value !== "" && search_description.value === "")?
                    `/api/v1/notes/search/${user_id}/?title=${search_title.value}&from_date=${from_search_date.value}&to_date=${to_search_date.value}` : 
                    (from_search_date.value !== "" && to_search_date.value !== "")?
                    `/api/v1/notes/search/${user_id}/?&from_date=${from_search_date.value}&to_date=${to_search_date.value}` :
                    `/api/v1/notes/search/${user_id}`;
  fetch(uri, {
    headers : {
      'content-type' : 'application/json',
      charset : 'utf-8'
    },
    method : 'GET'
  }).then(response => {return response.json()})
    .then(data => {
      notecards2.forEach(element => {
        card_display_block.removeChild(element);
      })
      notecards2 = [];
      data['data'].forEach(elelment => {
        let id = elelment['Note_Id'];
        let title = elelment['Note_Title'];
        let description = elelment['Note_Description'];
        let time = elelment['Note_Time'].slice(0,5);
        let date = elelment['Note_Date'].slice(0,10);
        date = date.slice(0,8) + (Number(date.slice(8,10)) + 1);
        const notecard = createcard(id, title, description, time, date);
        notecards2.push(notecard);
        const update_note = notecard.childNodes[1];
        update_note.addEventListener('click', () => {
          update_card(notecard);
        })
        const delete_note = notecard.childNodes[2].childNodes[3];
        delete_note.addEventListener('click', () => {
          let confirm_options = notecard.childNodes[2].childNodes[4];
          delete_note.style.display = "none";
          confirm_options.style.display = "block";
          confirm_options.childNodes[0].innerText = "Yes";
          confirm_options.childNodes[1].innerText = "No";
          confirm_options.childNodes[0].addEventListener('click', () => {
            delete_note(notecard);
          })
          confirm_options.childNodes[1].addEventListener('click', () => {
            delete_note.style.display = "flex";
            confirm_options.style.display = "none";
            confirm_options.childNodes[0].innerText = "Save";
            confirm_options.childNodes[1].innerText = "Cancel";
          });
        });
        notecards2.forEach(element => {
          element.style.animation = "disp-card 0.6s ease-in-out 1s forwards";
          window.getComputedStyle(element.childNodes[2].childNodes[2]).overflowY === "visible";
          window.getComputedStyle(element.childNodes[2].childNodes[2]).overflowY !== "hidden";      
        });
        card_display_section.style.overflowY = "hidden";
        card_display_block.style.overflowY = "hidden";
        document.getElementById("loading-design").style.animation = "removedisplay 0.5s ease-in-out 0.7s forwards";
        // search_icon.style.display = "block";
        setTimeout(() => {
          card_display_section.style.overflowY = "scroll";
          card_display_block.style.overflowY = "scroll";
          document.getElementById("loading-design").style.display = "none";
        }, 2000);
      });
      if(data['data'].length == 0){
        document.getElementById("loading-text").innerHTML = "&#128532; Data Not Found...";
        document.getElementById("loading-design").style.display = "block";
        document.getElementById("loading-design").style.animation = "none";        
      }
    }).catch(err => console.log(err));
});

let search_icon = document.getElementById("search-option");
let search_block = document.getElementById("search-options-menu");
search_block.style.transform = "translateY(-250px)";
search_icon.addEventListener('click', () => {
  if(search_block.style.transform === "translateY(-250px)"){
    search_icon.removeAttribute("class");
    search_icon.classList.add("bi-x-lg", "bi");
    card_display_block.style.transform = "translateY(225px)";
    search_block.style.transform = "translateY(0px)"
    setTimeout(() => {
      card_display_block.style.borderTop = "2px ridge black";
    }, 200);
  }
  else{
    search_icon.removeAttribute("class");
    search_icon.classList.add("bi-search", "bi");
    card_display_block.style.transform = "translateY(0px)";
    search_block.style.transform = "translateY(-250px)";
    document.getElementById("search-title").value = "";
    document.getElementById("search-description").value = "";
    document.getElementById("from-search-date").value = "";
    document.getElementById("to-search-date").value = "";
    setTimeout(() => {
      card_display_block.style.borderTop = "none";
    }, 300);
    if(notecards.length !== notecards2.length){
      notecards2.forEach(element => {
        card_display_block.removeChild(element);
      })
      notecards2 = [];
      for(let i = notecards3.length - 1; i >= 0; i--){
        notecards2.push(notecards3[i]);
        card_display_block.appendChild(notecards3[i]);
        document.getElementById("loading-design").style.animation = "removedisplay 0.5s ease-in-out 0.7s forwards";
        document.getElementById("loading-text").innerHTML = "NOW LOADING...";
        document.getElementById("loading-design").style.display = "none";
        // notecards3[i].style.animation = "none";
        notecards3[i].style.opacity = "1";
      }
    }
  }
})

document.addEventListener('DOMContentLoaded', () => {
  animation();
  let user_id = document.getElementById("user-id").innerText;
  user_id = user_id.slice(5, user_id.length);
  fetch(`/api/v1/notes/${user_id}`, {
    headers : {
      'content-type' : 'application/json',
      charset : 'utf-8'
    },
    method : 'GET'
  })
    .then(response => response.json())
    .then(responseObj => {
      loaddatabase_data(responseObj['Data']);
    })
    .catch(err => console.log(err));
})
function animation() {
  const welcome_box = document.getElementById("message-box");
  welcome_box.style.animation = "fadedisplay 1s ease-in-out 2s forwards";
  setTimeout(() => {
    const block = document.getElementById("block");
    welcome_box.style.display = "none";
    block.style.display = "flex";
    block.style.animation = "boxdisplay 0.6s linear forwards";
  }, 3000);
}

const loaddatabase_data = (data) => {
  if(data.length != 0){
    data.forEach(elelment => {
      let id = elelment['Note_Id'];
      let title = elelment['Note_Title'];
      let description = elelment['Note_Description'];
      let time = elelment['Note_Time'].slice(0,5);
      let date = elelment['Note_Date'].slice(0,10);
      date = date.slice(0,8) + (Number(date.slice(8,10)) + 1);
      const notecard = createcard(id, title, description, time, date)
      notecards2.push(notecard);
      notecards3.push(notecard);
      document.getElementById("note-title").value = "";
      document.getElementById("note-content").value = "";
      const update_note = notecard.childNodes[1];
      update_note.addEventListener('click', () => {
        update_card(notecard);
      })
      const delete_note_btn = notecard.childNodes[2].childNodes[3];
      delete_note_btn.addEventListener('click', () => {
        let confirm_options = notecard.childNodes[2].childNodes[4];
        delete_note_btn.style.display = "none";
        confirm_options.style.display = "block";
        confirm_options.childNodes[0].innerText = "Yes";
        confirm_options.childNodes[1].innerText = "No";
        confirm_options.childNodes[0].addEventListener('click', () => {
          delete_note(notecard);
        })
        confirm_options.childNodes[1].addEventListener('click', () => {
          delete_note_btn.style.display = "flex";
          confirm_options.style.display = "none";
          confirm_options.childNodes[0].innerText = "Save";
          confirm_options.childNodes[1].innerText = "Cancel";
        });
      });
      notecards2.forEach(element => {
        element.style.animation = "disp-card 0.6s ease-in-out 2s forwards";
        window.getComputedStyle(element.childNodes[2].childNodes[2]).overflowY === "visible";
        window.getComputedStyle(element.childNodes[2].childNodes[2]).overflowY !== "hidden";      
      });
      card_display_section.style.overflowY = "hidden";
      card_display_block.style.overflowY = "hidden";
      document.getElementById("loading-design").style.animation = "removedisplay 0.5s ease-in-out 1.6s forwards";
      setTimeout(() => {
        card_display_section.style.overflowY = "scroll";
        card_display_block.style.overflowY = "scroll";
        document.getElementById("loading-design").style.display = "none";
        notecard.style.opacity = "1";
        notecard.style.visibility = "visible";
        notecard.style.animation = "none";
      }, 6000);
    })
  }
  else if(data.length === 0){
    document.getElementById("loading-design").style.display = "none";
    document.getElementById("null-image").style.display = "block";
  }
}

function update_card(card){
  card.style.height = "500px";
  let card_description = card.childNodes[2].childNodes[2].childNodes[1];
  let card_title = card.childNodes[2].childNodes[2].childNodes[0];
  let card_title_data = card_title.innerText;
  let card_descp_data = card_description.innerText;
  let delete_btn = card.childNodes[2].childNodes[3];
  card.childNodes[2].childNodes[2].style.display = "none";
  delete_btn.style.display = "none";

  setTimeout(() => {
    let update_title = card.childNodes[2].childNodes[0];
    let update_description = card.childNodes[2].childNodes[1];
    update_title.style.display = "block";
    update_description.style.display = "block";
    update_title.value = card_title_data;
    update_description.value = card_descp_data;
    card.childNodes[2].childNodes[4].style.display = "block";
    
    let cancel_edit = card.childNodes[2].childNodes[4].childNodes[1];
    cancel_edit.addEventListener('click', () => {
      card.style.height = "50%";
      card.childNodes[2].childNodes[2].style.display = "block";
      delete_btn.style.display = "flex";
      update_title.style.display = "none";
      update_description.style.display = "none";
      card.childNodes[2].childNodes[4].style.display = "none";
    });

    let save_edit = card.childNodes[2].childNodes[4].childNodes[0];
    save_edit.addEventListener('click', () => {
      let id = card.childNodes[0].innerText;
      id = id.slice(5,(id.length));
      const data = {
        note_id : id,
        note_title : (update_title.value !== card_title_data) ? update_title.value : undefined,
        note_description : (update_description.value !== card_descp_data) ? update_description.value : undefined
      };
      fetch(`/api/v1/notes/${id}`, {
        headers : {
          'content-type' : 'application/json',
          charset : 'utf-8'
        },
        method : 'PATCH',
        body : JSON.stringify(data)
      }).then(response => {return response.json()})
      .then(data => {
        data = data['data'];
        for (let index = 0; index < notecards.length; index++) {
          if(notecards[index].note_id === data.note_id){
            notecards[index].note_title = (data['Note_Title'])? data['Note_Title'] :  notecards[index].note_title;
            notecards[index].note_description = (data['Note_Description'])? data['Note_Description'] :  notecards[index].note_description;
            break;
          }
        }
        card.style.height = "50%";
        if(data['Note_Title'] !== undefined) card_title.innerText = data['Note_Title'];
        if(data['Note_Description'] !== undefined) card_description.innerText = data['Note_Description'];
        card.childNodes[2].childNodes[2].style.display = "block";
        delete_btn.style.display = "flex";
        update_title.style.display = "none";
        update_description.style.display = "none";
        card.childNodes[2].childNodes[4].style.display = "none";
        let status_msg = document.getElementById("status-message");
        status_msg.style.display = "flex";
        status_msg.innerText = "Card Data Updated Successfully";
        status_msg.style.animation = "status_appear 0.8s ease-in-out 1s forwards";
        setTimeout(() => {
          document.getElementById("status-message").style.position = "sticky";
          status_msg.style.animation = "status_disappear 1.2s ease-in-out forwards";
          setTimeout(() => {
            document.getElementById("status-message").style.display = "none";
            document.getElementById("status-message").style.position = "absolute";
          }, 3200);
        }, 3000);
      });
    });
  }, 100);
};

const hamburger = document.getElementById("logout-menu");
let menu_box = document.getElementById("menu");
menu_box.style.display = "none"
hamburger.addEventListener("click", () => {
  if(menu_box.style.display === "none"){
    menu_box.style.display = "flex";
    document.querySelector(".bi-caret-down-fill").style.transform = "rotate(180deg)";
  } 
  else{
    menu_box.style.display = "none"
    document.querySelector(".bi-caret-down-fill").style.transform = "none";
  }
})
// document.body.addEventListener('click', () => {
//   let menu_box = document.getElementById("menu");
//   menu_box.style.display = "none";
// })

const createnote_button = document.getElementById("create-notecard");
createnote_button.addEventListener('click', () => {
  let user_id = document.getElementById("user-id").innerText;
  user_id = user_id.slice(5, user_id.length);
  let title = document.getElementById("note-title").value;
  let description = document.getElementById("note-content").value;
  const date = new Date();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let currentTime = `${hour}:${(Number(minute) > 9)? minute : `0${minute}`}`;
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}-${month}-${day}`;
  document.getElementById("note-title").value = "";
  document.getElementById("note-content").value = "";
  fetch('/api/v1/notes', {
    headers : {
      'content-type' : 'application/json',
      charset : 'utf-8'
    },
    method : 'POST',
    body : JSON.stringify({note_title: title, note_description: description, user_id : user_id})
  }).then((response) => {
    return response.json();
  }).then((responseObj) => {
    const {note_id, note_title, note_description} = responseObj['result'];
    const notecard = createcard(note_id, note_title, note_description, currentTime, currentDate);
    notecards2.push(notecard);
    notecards3.push(notecard);
    document.getElementById("null-image").style.animation = "removedisplay 0.5s ease-in-out forwards";
    setTimeout(() => {
      document.getElementById("null-image").style.display = "none";
    }, 1000);
    notecard.style.animation = "disp-card 0.6s ease-in-out 0.6s forwards";
    const delete_note_btn = notecard.childNodes[2].childNodes[3];
    let status_msg = document.getElementById("status-message");
    status_msg.style.display = "flex";
    status_msg.innerText = "Note Card Created Successfully";
    status_msg.style.animation = "status_appear 0.8s ease-in-out 1s forwards";
    window.getComputedStyle(notecard.childNodes[2].childNodes[2]).overflowY === "visible";
      window.getComputedStyle(notecard.childNodes[2].childNodes[2]).overflowY !== "hidden";
    setTimeout(() => {
      status_msg.style.animation = "status_disappear 1.2s ease-in-out forwards";
      setTimeout(() => {
        document.getElementById("status-message").style.display = "none";
      }, 1200);
    }, 3000);
    const update_note = notecard.childNodes[1];
    update_note.addEventListener('click', () => {
      update_card(notecard);
    })
    delete_note_btn.addEventListener('click', () => {
      let confirm_options = notecard.childNodes[2].childNodes[4];
      delete_note_btn.style.display = "none";
      confirm_options.style.display = "block";
      confirm_options.childNodes[0].innerText = "Yes";
      confirm_options.childNodes[1].innerText = "No";
      confirm_options.childNodes[0].addEventListener('click', () => {
        delete_note(notecard);
      })
      confirm_options.childNodes[1].addEventListener('click', () => {
        delete_note_btn.style.display = "flex";
        confirm_options.style.display = "none";
        confirm_options.childNodes[0].innerText = "Save";
        confirm_options.childNodes[1].innerText = "Cancel";
      });
    });
  }).catch((err) => {
    console.log(err);
  })
})


const delete_note = (notecard) => {
  let id  = notecard.firstChild.innerText;
  id = parseInt(id.slice(5,(id.length)), 10);
  fetch(`/api/v1/notes/${id}`, {
    headers : {
      'content-type' : 'application/json',
      charset : 'utf-8'
    },
    method : 'DELETE',
    body : JSON.stringify({note_id : id})
  }).then(response => {return response.json()})
    .then(responseobj => {
      notecards = notecards.filter((elelment) => {
        return elelment.note_id !== id;
      })
      let status_msg = document.getElementById("status-message");
      status_msg.style.display = "flex";
      status_msg.innerText = responseobj['result'];
      status_msg.style.animation = "status_appear 0.8s ease-in-out 0.7s forwards";
      setTimeout(() => {
        status_msg.style.animation = "status_disappear 1.2s ease-in-out forwards";
        setTimeout(() => {
          document.getElementById("status-message").style.display = "none";
        }, 1200);
      }, 2000);
      card_display_block.removeChild(notecard);
      if(notecards.length === 0) document.getElementById("null-image").style.display = "block";
    });
}

const createcard = (id, title, description, time, date) => {
    let note_card = document.createElement("div");
    note_card.classList.add("notecard");
    let name = document.getElementById('user-name').innerText;
    name = name.split(' ');
    let name_code = '';
    name.forEach(el => {
	    name_code += el.slice(0,1);
    })
    note_card.setAttribute("id", (name_code + id));
    card_display_block.insertBefore(note_card, card_display_block.firstChild);
    let note_id = document.createElement("div");
    note_card.appendChild(note_id);
    note_id.classList.add("note-id");
    note_id.innerText = `Id - ${id}`;
    let edit_icon_block = document.createElement('div');
    edit_icon_block.setAttribute("id", "edit-icon");
    note_card.appendChild(edit_icon_block);
    let edit_icon = document.createElement("i");
    edit_icon.classList.add("bi", "bi-pencil");
    edit_icon_block.appendChild(edit_icon)
    let card_front_body = document.createElement("div");
    note_card.appendChild(card_front_body);
    card_front_body.classList.add("card-body-front");
    let update_title = document.createElement('input');
    update_title.setAttribute("type", "text");
    update_title.setAttribute("name", "note-update-title");
    update_title.setAttribute("id", "note-update-title");
    card_front_body.appendChild(update_title);
    let update_description = document.createElement('textarea');
    update_description.setAttribute("name", "note-update-content");
    update_description.setAttribute("id", "note-update-content");
    card_front_body.appendChild(update_description);
    let note_body = document.createElement("p");
    card_front_body.appendChild(note_body);
    let note_title = document.createElement("h3");
    let note_description = document.createElement("p");
    note_title.setAttribute("id","note-title");
    note_description.classList.add("note_description");
    note_body.appendChild(note_title);
    note_body.appendChild(note_description);
    note_title.innerText = title;
    note_description.innerText = description;
    let delete_btn = document.createElement("div");
    card_front_body.appendChild(delete_btn);
    delete_btn.classList.add("btn", "delete-note-btn");
    delete_btn.innerHTML = `<i class="bi bi-file-earmark-x"></i><div id="delete-note-text">Delete Note</div>`;
    let editcard_btns = document.createElement('div');
    editcard_btns.classList.add("edit-card-btns");
    editcard_btns.setAttribute('id', 'editcard-btn');
    card_front_body.appendChild(editcard_btns);
    let save_notebtn = document.createElement("div");
    let cancel_edit = document.createElement("div");
    save_notebtn.classList.add("btn", "save-note-btn");
    cancel_edit.classList.add("cancel-edit");
    save_notebtn.innerText = "SAVE";
    cancel_edit.innerText = "CANCEL";
    editcard_btns.appendChild(save_notebtn);
    editcard_btns.appendChild(cancel_edit);
    let card_footer = document.createElement("div");
    card_front_body.appendChild(card_footer);
    card_footer.classList.add("note-footer-portion");
    let creation_time = document.createElement("div");
    card_footer.appendChild(creation_time);
    creation_time.classList.add("creation-time");
    creation_time.innerHTML = `Time : ${time}`;
    let creation_date = document.createElement('div');
    card_footer.appendChild(creation_date);
    creation_date.classList.add("creation-date");
    creation_date.innerHTML = `Date : ${date}`;
    notecards.push({
      note_id : id,
      note_title: title,
      note_description : description,
      note_time : time,
      note_date : date
    })
    return note_card;
}

const my_profile_icon = document.getElementById("my-profile");

const reg_date = document.getElementById("user-reg-date");
reg_date.innerText = `Member Since : ${(reg_date.innerText).slice(0,15)}`;

my_profile_icon.addEventListener('click', () => {
  document.getElementById("profile-data").style.display = "flex";
  setTimeout(() => {
    document.getElementById("block").classList.add("card-display-section");
    // document.getElementById("block").style.cursor = "not-allowed";
  }, 700);
  notecards2.forEach(element => {
    element.style.transform = "scale(0.8)";
  })
});

document.getElementById("back-profile-card").addEventListener('click', () => {
  document.getElementById("profile-data").style.display = "none";
  document.getElementById("image-block").style.transform = "translateX(0px)";
  document.getElementById("upload-form").style.transform = "translateX(350px)";
  setTimeout(() => {
    document.getElementById("block").classList.remove("card-display-section");
    // document.getElementById("block").style.cursor = "not-allowed";
  }, 700);
  notecards2.forEach(element => {
    element.style.transform = "scale(1)";
  })
});

document.getElementById("upload-image-button").addEventListener('click', () => {
  document.getElementById("image-block").style.transform = "translateX(350px)";
  document.getElementById("upload-form").style.transform = "translateX(0px)";
})

const image_validation = async () => {
  let returnval = true;
  let input = document.getElementById("image-file");
  let image_file = input.files[0];

  const limit = 2000;
  const size = image_file.size/1024;

  if(size > limit){
    console.log('Size Error');
    returnval = false;
  }
  if(image_file.type !== "image/jpeg" && image_file.type !== "image/jpg" && image_file.type !== "image/png"){
    console.log("Invalid File");
    returnval = false;
  }

  if(returnval === true) image_upload();

  return returnval;
}

const image_upload = async () => {
  let user_id = document.getElementById("user-id").innerText;
    user_id = user_id.slice(5, user_id.length);
    const formData = new FormData();
    formData.append(image_file.name, image_file);
    const response = await fetch("/upload/image", {
      method : 'POST',
      body : {formData, id : user_id}
    })
      .then(response => {return response.json()})
      .then(data => {
        console.log(data)
      })
}

document.getElementById("log-out-option").addEventListener('click', () => {
  fetch('http://localhost:3500/auth/LogOut', {
    method : 'GET'
  }).then(_ => location.assign('/'));
})
