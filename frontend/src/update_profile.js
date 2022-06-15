import { profile } from './profile.js';

export function update_profile(apiUrl,token,curr_name,curr_email) {
    // Clear current content
    let content = document.querySelector('[role="main"]');
    while (content.firstChild) {
        content.firstChild.remove();
    }
    // Create forms
    let div = document.createElement("div");
    div.setAttribute('class','form');

    // Update profile header
    let update_h = document.createElement("h1");
    let update_text = document.createTextNode("Update profile");
    update_h.appendChild(update_text);
    div.appendChild(update_h);
    
    // Name label
    let name_l = document.createElement("label");
    name_l.setAttribute('for','name')
    let name = document.createTextNode("Name: ");
    name_l.appendChild(name);
    div.appendChild(name_l);

    div.appendChild(document.createElement("br"));

    // Name input
    let name_i = document.createElement("input");
    name_i.setAttribute('type','text');
    name_i.setAttribute('id','name');
    name_i.setAttribute('spellcheck','false');
    name_i.value = curr_name;
    div.appendChild(name_i);

    div.appendChild(document.createElement("br"));

    // Email label
    let email_l = document.createElement("label");
    email_l.setAttribute('for','email')
    let email = document.createTextNode("Email address: ");
    email_l.appendChild(email);
    div.appendChild(email_l);

    div.appendChild(document.createElement("br"));

    // Email input
    let email_i = document.createElement("input");
    email_i.setAttribute('type','text');
    email_i.setAttribute('id','email');
    email_i.setAttribute('spellcheck','false');
    email_i.value = curr_email;
    div.appendChild(email_i);

    div.appendChild(document.createElement("br"));

    // Password label
    let password_l = document.createElement("label");
    password_l.setAttribute('for','password')
    let password = document.createTextNode("Password: ");
    password_l.appendChild(password);
    div.appendChild(password_l);

    div.appendChild(document.createElement("br"));

    // Password input
    let password_i = document.createElement("input");
    password_i.setAttribute('type','password');
    password_i.setAttribute('id','password');
    password_i.setAttribute('spellcheck','false');
    div.appendChild(password_i);

    div.appendChild(document.createElement("br"));

    // Repeat password label
    let r_password_l = document.createElement("label");
    r_password_l.setAttribute('for','r_password')
    let r_password = document.createTextNode("Repeat password: ");
    r_password_l.appendChild(r_password);
    div.appendChild(r_password_l);

    div.appendChild(document.createElement("br"));

    // Repeat password input
    let r_password_i = document.createElement("input");
    r_password_i.setAttribute('type','password');
    r_password_i.setAttribute('id','r_password');
    r_password_i.setAttribute('spellcheck','false');
    div.appendChild(r_password_i);

    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));

    // Submit button
    let submit_b = document.createElement("btn");
    submit_b.setAttribute('type','submit');
    submit_b.setAttribute('id','submit');
    submit_b.setAttribute('class','button button-submit');
    submit_b.style = "cursor:pointer";
    let submit = document.createTextNode("Save changes");
    submit_b.appendChild(submit);
    div.appendChild(submit_b);
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));

    document.querySelector('[role="main"]').appendChild(div);

    // Handle submit
    document.getElementById("submit").addEventListener("click", function() {
        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let r_password = document.getElementById("r_password").value;

        // Deal with invalid usernames and passwords
        if (name.localeCompare("") == 0) {
            printmsg("Error: Name must not be blank");
        }
        else if (email.localeCompare("") == 0) {
            printmsg("Error: Email address must not be blank");
        }
        else if (password.localeCompare("") == 0) {
            printmsg("Error: Both password fields must be filled");
        }
        else if (r_password.localeCompare("") == 0) {
            printmsg("Error: Both password fields must be filled");
        }
        else if (r_password.localeCompare(password) != 0) {
            printmsg("Error: Password fields must be equal");
        }
        // All fields are filled in
        else {
            let details = {
                method : 'PUT',
                headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Token '+token
                },
                body: JSON.stringify({
                'email': email,
                'name': name,
                'password': password
                })
            }
            fetch(apiUrl + "/user",details)
            .then((res) => {
                if (res.status == 200) {
                    res.json()
                    .then((data) => {
                        printmsg("Change successful!");
                    });
                }
            });
        }
    });
}

// Display a message
function printmsg(msg) {
    let errormsg_p = document.createElement("p");
    errormsg_p.setAttribute('id','errormsg');
    errormsg_p.style = "color:#FFFFFF; margin-left:25%;";
    let errormsg = document.createTextNode(msg);
    errormsg_p.appendChild(errormsg);
    document.querySelector('[role="main"]').appendChild(errormsg_p);
    setTimeout(function() {
        document.getElementById("errormsg").remove();
    }, 2000);
}