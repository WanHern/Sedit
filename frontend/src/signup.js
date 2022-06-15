import { userfeed } from './userfeed.js';

export function signup(apiUrl) {
    // Clear current content
    let content = document.querySelector('[role="main"]');
    while (content.firstChild) {
        content.firstChild.remove();
    }
    // Create forms
    let div = document.createElement("div");
    div.setAttribute('class','form');
    
    // Signup header
    let signup_h = document.createElement("h1");
    let signup_text = document.createTextNode("Sign up");
    signup_h.appendChild(signup_text);
    div.appendChild(signup_h);

    // Username label
    let username_l = document.createElement("label");
    username_l.setAttribute('for','username')
    let username = document.createTextNode("Username: ");
    username_l.appendChild(username);
    div.appendChild(username_l);

    div.appendChild(document.createElement("br"));

    // Username input
    let username_i = document.createElement("input");
    username_i.setAttribute('type','text');
    username_i.setAttribute('id','username');
    username_i.setAttribute('spellcheck','false');
    div.appendChild(username_i);

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
    div.appendChild(document.createElement("br"));

    // Submit button
    let submit_b = document.createElement("btn");
    submit_b.setAttribute('type','submit');
    submit_b.setAttribute('id','submit');
    submit_b.setAttribute('class','button button-submit');
    submit_b.style = "cursor:pointer";
    let submit = document.createTextNode("Sign up");
    submit_b.appendChild(submit);
    div.appendChild(submit_b);
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));

    document.querySelector('[role="main"]').appendChild(div);

    // Handle submit
    document.getElementById("submit").addEventListener("click", function() {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        // Deal with invalid usernames and passwords
        if (username.localeCompare("") == 0) {
            printmsg("Error: Username must not be blank");
        }
        else if (password.localeCompare("") == 0) {
            printmsg("Error: Password must not be blank");
        }
        else {
            let details = {
                method : 'POST',
                headers : {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                'username': username,
                'password': password,
                'email': "",
                'name': ""
                })
            }
            fetch(apiUrl + "/auth/signup",details)
            .then((res) => {
                if (res.status == 200) {
                    res.json()
                    .then((data) => {
                        // Store in local storage to "remember" user logged in
                        if (typeof(Storage) !== "undefined") {
                            localStorage.setItem("token",data.token);
                            // Store user id
                            let details = {
                                method : 'GET',
                                headers : {
                                'Content-Type': 'application/json',
                                'Authorization': 'Token '+data.token
                                }
                            }
                            fetch(apiUrl + "/user/",details)
                            .then((result) => result.json())
                            .then((dat) => {
                                localStorage.setItem("id",dat.id);
                            });
                        }
                        userfeed(apiUrl,data.token);
                    })
                }
                else if (res.status == 400) {
                    printmsg("Error: Something broke D:");
                }
                else if (res.status == 409) {
                    printmsg("Error: This username is taken");
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