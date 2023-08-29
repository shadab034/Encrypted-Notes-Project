const formblock = document.getElementById("login-form-block");
const Login_Form = document.getElementById("login-form");
const SignUp_Form = document.getElementById("sign-up-form");
const circle_mover = document.getElementById("circle");
const arrow = document.getElementById("arrow");
const show_btn = document.getElementById("password-show");
const lpassword = document.getElementById("login-password");
const lemail = document.getElementById("login-email");
const rpassword = document.getElementById("register-password");
const remail = document.getElementById("register-email");
const full_name = document.getElementById("name");
const welcome_box = document.getElementById("message-box");
const confirm_pass = document.getElementById("confirm-password");

setTimeout(() => {
  block.style.animation = "formdisplay 0.6s ease-in-out forwards";
}, 500);

const name_validation = () => {
  let pattern = /[0-9]/g;
  let returnval = false;
  let result = document.getElementById("name").value.match(pattern);
  if (result) {
    document.getElementById("name-instruction").style.visibility = "visible";
    document.getElementById("instruction-text").innerHTML =
      "You can't enter Number in Name Field";
  } else {
    document.getElementById("name-instruction").style.visibility = "hidden";
    returnval = true;
  }
  return returnval;
}

const login_email_validator =  () => {
  let returnval = false;
  if(!lemail.value.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
    document.getElementById("login-email-id").style.visibility = "visible";
    document.getElementById("email-id-confirm-content").style.color = "red";
  }
 else{
    document.getElementById("email-id-confirm-content").style.color = "green";
    setTimeout(() => {
      document.getElementById("login-email-id").style.visibility = "hidden";
    }, 500);
    returnval = true;
  }
  return returnval;
}

const email_validator = () => {
  let returnval = false;
  if(!remail.value.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
    document.getElementById("email-instruction").style.visibility = "visible";
    document.getElementById("email-instruction-text").style.color = "red";
  }
 else{
    document.getElementById("email-instruction-text").style.color = "green";
    setTimeout(() => {
      document.getElementById("email-instruction").style.visibility = "hidden";
    }, 500);
    returnval = true;
  }
  return returnval;
}

const password_validator = () => {
  let num = /[0-9]/g;
  let result_num = rpassword.value.match(num);

  if (result_num) document.getElementById("number").style.color = "green";
  else document.getElementById("number").style.color = "red";

  let password_len = rpassword.value;
  password_len = password_len.trim();
  if (password_len.length >= 8)
    document.getElementById("length").style.color = "green";
  else document.getElementById("length").style.color = "red";

  let special = /[!\@\#\$\%\^\&\*\(\)\_\-\+\=\?\>\<\.\,]/;
  if (rpassword.value.match(special)) {
    document.getElementById("special-char").style.color = "green";
  } else {
    document.getElementById("special-char").style.color = "red";
  }

  let capital_char = /[A-Z]/g;
  if (rpassword.value.match(capital_char)) {
    document.getElementById("capital-char").style.color = "green";
  } else {
    document.getElementById("capital-char").style.color = "red";
  }
  if (
    rpassword.value.match(special) &&
    rpassword.value.match(capital_char) &&
    password_len.length >= 8 &&
    result_num
  ) {
    setTimeout(() => {
      document.getElementById("password-instruction").style.visibility = "hidden";
    }, 500);
    return true;
  } else {
    document.getElementById("password-instruction").style.visibility =
      "visible";
      return false;
  }
}

const password_confirmation = () => {
  let pass_val = confirm_pass.value;
  if (pass_val == rpassword.value) {
    document.getElementById("password-conf").style.color = "green";
    setTimeout(() => {
      document.getElementById("confirm-pass-block").style.visibility = "hidden";
    }, 500);
    return true;
  } else {
    document.getElementById("password-conf").style.color = "red";
    document.getElementById("confirm-pass-block").style.visibility = "visible";
    return false;
  }
}


// formblock.style.transform = "rotateY(0deg)";
document
  .getElementById("form-side-flipper")
  .addEventListener("click", () => {
    const login_text = document.getElementById("login-text");
    const reg_text = document.getElementById("reg-text");
    if (formblock.style.transform == "rotateY(0deg)") {
      formblock.style.transform = "rotateY(180deg)";
      circle_mover.style.transform = "translateX(50px)";
      arrow.style.transform = "rotate(-270deg)";
      login_text.style.textShadow = "none";
      reg_text.style.textShadow = "-2px 4px 7px rgb(10, 10, 10)";
      lemail.value = "";
      lpassword.value = "";
      document.getElementById("login-email-id").style.visibility = "hidden";
    } else if ((formblock.style.transform = "rotateY(180deg)")) {
      formblock.style.transform = "rotateY(0deg)";
      circle_mover.style.transform = "translateX(-10px)";
      arrow.style.transform = "rotate(0deg)";
      login_text.style.textShadow = "-2px 4px 7px rgb(10, 10, 10)";
      reg_text.style.textShadow = "none";
      full_name.value = "";
      remail.value = "";
      rpassword.value = "";
      confirm_pass.value = "";
      document.getElementById("name-instruction").style.visibility = "hidden";
      document.getElementById("email-instruction").style.visibility = "hidden";
      document.getElementById("password-instruction").style.visibility = "hidden";
      document.getElementById("confirm-pass-block").style.visibility = "hidden";
    }
  });

document
  .getElementById("password-show")
  .addEventListener("click", () => {
    let close = document.getElementById("l-close-eye");
    let open = document.getElementById("l-open-eye");
    if (lpassword.type == "password") {
      lpassword.type = "text";
      close.style.display = "none";
      open.style.display = "block";
    } else if (lpassword.type == "text") {
      lpassword.type = "password";
      close.style.display = "block";
      open.style.display = "none";
    }
  });

document
  .getElementById("reg-password-show")
  .addEventListener("click", () => {
    let close = document.getElementById("r-close-eye");
    let open = document.getElementById("r-open-eye");
    if (rpassword.type == "password") {
      rpassword.type = "text";
      close.style.display = "none";
      open.style.display = "block";
    } else if (rpassword.type == "text") {
      rpassword.type = "password";
      close.style.display = "block";
      open.style.display = "none";
    }
  });

rpassword.addEventListener("click", (e) => {
  let password_instruction = document.getElementById("password-instruction");
  password_instruction.style.visibility = "visible";
});

full_name.addEventListener("input", name_validation);

remail.addEventListener('input', email_validator);

rpassword.addEventListener("input", password_validator);
rpassword.addEventListener('blur', () => {
  document.getElementById("password-instruction").style.visibility = "hidden";
})

confirm_pass.addEventListener("input", password_confirmation);

lemail.addEventListener('input', login_email_validator)

const reg_validation = (e) => {
  let returnval = true;
  document.getElementById("name-instruction").style.visibility = "hidden";
  document.getElementById("email-instruction").style.visibility = "hidden";
  document.getElementById("password-instruction").style.visibility = "hidden";
  document.getElementById("confirm-pass-block").style.visibility = "hidden";

  if(!(name_validation())) returnval = false;
  if(!(email_validator())) returnval = false;
  if(!(password_validator())) returnval = false;
  if(!(password_confirmation())) returnval = false;

  return returnval;
};

document.getElementById("forgot-password-link").addEventListener('click', async (e) => {
  e.preventDefault();
  let data = lemail.value;
  if(login_email_validator()){
    document.getElementById("user-reg-details").style.color = "rebeccapurple";
    document.getElementById("user-reg-details").innerText = "Sending reset password link on your email....";
    fetch(`/forgot-password/?email=${data}`, {
      method : "POST",
      body : JSON.stringify({email : data})
    }).then(response => {return response.json()})
    .then(data => {
        console.log(data);
        if(data['status'] === undefined){
          document.getElementById("user-reg-details").style.color = "green";
        } 
        else if(data['status'] === 404){
          document.getElementById("user-reg-details").style.color = "red";
        }
        document.getElementById("user-reg-details").innerText = data['message'];
      })
      .catch(err => console.log(err));
  };

});

const login_validation = () => {
  let returnval = true;
  document.getElementById("login-email-id").style.visibility = "hidden";

  if(!(login_email_validator())) returnval = false;
  
  return returnval;
}