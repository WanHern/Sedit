import { userfeed } from './userfeed.js';

export function new_post(apiUrl,token) {
    // Clear current content
    let content = document.querySelector('[role="main"]');
    while (content.firstChild) {
        content.firstChild.remove();
    }

    // Create forms
    let div = document.createElement("div");
    div.setAttribute('class','form');

    // New post
    let header = document.createElement("h1");
    let header_text = document.createTextNode("New post");
    header.appendChild(header_text);
    div.appendChild(header);
    
    // Title label
    let title_l = document.createElement("label");
    title_l.setAttribute('for','title')
    let title = document.createTextNode("Title: ");
    title_l.appendChild(title);
    div.appendChild(title_l);

    div.appendChild(document.createElement("br"));

    // Title input
    let title_i = document.createElement("input");
    title_i.setAttribute('type','text');
    title_i.setAttribute('id','title');
    title_i.setAttribute('spellcheck','false');
    div.appendChild(title_i);

    div.appendChild(document.createElement("br"));

    // Subseddit label
    let subseddit_l = document.createElement("label");
    subseddit_l.setAttribute('for','subseddit')
    let subseddit = document.createTextNode("Subseddit: ");
    subseddit_l.appendChild(subseddit);
    div.appendChild(subseddit_l);

    div.appendChild(document.createElement("br"));

    // Subseddit input
    let subseddit_i = document.createElement("input");
    subseddit_i.setAttribute('type','text');
    subseddit_i.setAttribute('id','subseddit');
    subseddit_i.setAttribute('spellcheck','false');
    div.appendChild(subseddit_i);

    div.appendChild(document.createElement("br"));

    // Text label
    let text_l = document.createElement("label");
    text_l.setAttribute('for','text')
    let text = document.createTextNode("Text: ");
    text_l.appendChild(text);
    div.appendChild(text_l);

    div.appendChild(document.createElement("br"));

    // Text input
    let text_t = document.createElement("textarea");
    text_t.setAttribute('type','text');
    text_t.setAttribute('id','text');
    text_t.setAttribute('spellcheck','false');
    text_t.setAttribute('rows','10');
    text_t.setAttribute('cols','50');
    div.appendChild(text_t);

    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));

    // Image label
    let image_l = document.createElement("label");
    image_l.setAttribute('for','image')
    let image = document.createTextNode("Image (optional): ");
    image_l.appendChild(image);
    div.appendChild(image_l);

    div.appendChild(document.createElement("br"));

    // Image input
    let image_i = document.createElement("input");
    image_i.setAttribute('type','file');
    image_i.setAttribute('id','image');
    div.appendChild(image_i);

    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));

    // Submit button
    let submit_b = document.createElement("btn");
    submit_b.setAttribute('type','submit');
    submit_b.setAttribute('id','submit');
    submit_b.setAttribute('class','button button-submit');
    submit_b.style = "cursor:pointer";
    let submit = document.createTextNode("Post");
    submit_b.appendChild(submit);
    div.appendChild(submit_b);
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));

    document.querySelector('[role="main"]').appendChild(div);

    // Handle submit
    document.getElementById("submit").addEventListener("click", function() {
        let title = document.getElementById("title").value;
        let subseddit = document.getElementById("subseddit").value;
        let text = document.getElementById("text").value;
        let image = document.querySelector('input[type=file]')

        // Deal with empty fields
        if (title.localeCompare("") == 0) {
            printmsg("Error: Title must not be blank");
        }
        else if (subseddit.localeCompare("") == 0) {
            printmsg("Error: Subseddit must not be blank");
        }
        else if (text.localeCompare("") == 0) {
            printmsg("Error: Text must not be blank");
        }
        // All three fields are filled
        else {
            // If no image uploaded
            if (image.value.localeCompare("") == 0) {
                let post_details = {
                    method : 'POST',
                    headers : {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token '+token
                    },
                    body: JSON.stringify({
                        'title': title,
                        'text': text,
                        'subseddit': subseddit
                    })
                };
                // Fetch
                fetch(apiUrl + "/post",post_details)
                .then((res) => {
                    if (res.status == 200) {
                        res.json()
                        .then((data) => {
                            userfeed(apiUrl,token);
                        });
                    }
                    else if (res.status == 400) {
                    }
                });
            }
            // If image was uploaded
            else {
                imageToBase64(image);
                // Ensure that image_b64 has been set in localStorage before retrieval
                setTimeout(() => {
                    let post_details = {
                        method : 'POST',
                        headers : {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token '+token
                        },
                        body: JSON.stringify({
                            'title': title,
                            'text': text,
                            'subseddit': subseddit,
                            'image': localStorage.getItem("image_b64")
                        })
                    };
                    // Fetch
                    fetch(apiUrl + "/post",post_details)
                    .then((res) => {
                        if (res.status == 200) {
                            res.json()
                            .then((data) => {
                                userfeed(apiUrl,token);
                            });
                        }
                        else if (res.status == 400) {
                        }
                    });    
                }, 300);
            }
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

function imageToBase64(image) {
    let file = image.files[0];
    let reader = new FileReader();
    reader.onloadend = function() {
        let image_b64 = reader.result.split("data:image/jpeg;base64,")[1];
        localStorage.setItem("image_b64",image_b64);
    }
    reader.readAsDataURL(file);
}