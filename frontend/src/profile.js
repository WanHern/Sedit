import { update_profile } from "./update_profile.js";

export function profile(apiUrl,token) {
    // Clear current content
    let content = document.querySelector('[role="main"]');
    while (content.firstChild) {
        content.firstChild.remove();
    }

    // Create div to store info
    let div = document.createElement("div");
    div.setAttribute('class','form');


    // Create header
    let profile_h = document.createElement("h1");
    profile_h.appendChild(document.createTextNode("Profile information"));
    div.appendChild(profile_h);

    // Get user info
    let details = {
        method : 'GET',
        headers : {
        'Content-Type': 'application/json',
        'Authorization': 'Token '+token
        }
    }
    fetch(apiUrl + "/user/",details)
    .then((res) => res.json())
    .then((data) => {
        // Username header
        let username_h = document.createElement("b");
        username_h.appendChild(document.createTextNode("Username:"));
        div.appendChild(username_h);

        // Username
        let username_p = document.createElement("p");
        let username = document.createTextNode(data.username);
        username_p.appendChild(username);
        div.appendChild(username_p);

        // Name header
        let name_h = document.createElement("b");
        name_h.appendChild(document.createTextNode("Name:"));
        div.appendChild(name_h);

        // Name
        let name_p = document.createElement("p");
        let name = document.createTextNode(data.name);
        name_p.appendChild(name);
        div.appendChild(name_p);

        // Email header
        let email_h = document.createElement("b");
        email_h.appendChild(document.createTextNode("Email:"));
        div.appendChild(email_h);

        // Email
        let email_p = document.createElement("p");
        let email = document.createTextNode(data.email);
        email_p.appendChild(email);
        div.appendChild(email_p);

        // Num of posts header
        let posts_h = document.createElement("b");
        posts_h.appendChild(document.createTextNode("Number of posts:"));
        div.appendChild(posts_h);

        // Num of posts
        let posts_p = document.createElement("p");
        let posts = document.createTextNode(data.posts.length);
        posts_p.appendChild(posts);
        div.appendChild(posts_p);

        // Num of upvotes header
        let upvotes_h = document.createElement("b");
        upvotes_h.appendChild(document.createTextNode("Number of upvotes:"));
        div.appendChild(upvotes_h);

        // Num of upvotes
        let upvotes_p = document.createElement("p");
        let total_upvotes = 0;
        for (let i = 0; i < data.posts.length; i++) {
            let posts_details = {
                method : 'GET',
                headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Token '+token,
                }
            }
            fetch(apiUrl + "/post?id=" + data.posts[i],posts_details)
            .then((res) => res.json())
            .then((data) => {
                total_upvotes += Number(data.meta.upvotes.length);
                if (typeof(Storage) !== "undefined") {
                    // Store total upvotes in local storage
                    localStorage.total_upvotes = total_upvotes;
                }
            });
        }
        // Make sure total upvotes has been set in localStorage before proceeding
        setTimeout(function() {
            let upvotes = document.createTextNode(localStorage.getItem("total_upvotes"));
            upvotes_p.appendChild(upvotes);
            div.appendChild(upvotes_p);
            // Remove total upvotes from local storage
            localStorage.total_upvotes = 0;
        }, 200);
        document.querySelector('[role="main"]').appendChild(div);

        // Update profile button is loaded after total upvotes
        setTimeout(function() {
            // Update profile button
            div.appendChild(document.createElement("br"));
            let submit_b = document.createElement("btn");
            submit_b.setAttribute('type','submit');
            submit_b.setAttribute('id','submit');
            submit_b.setAttribute('class','button button-submit');
            submit_b.style = "cursor:pointer";
            let submit = document.createTextNode("Update profile");
            submit_b.appendChild(submit);
            div.appendChild(submit_b);
            div.appendChild(document.createElement("br"));
            div.appendChild(document.createElement("br"));

            // Event listener for update profile
            submit_b.addEventListener("click", function() {
                update_profile(apiUrl,token,data.name,data.email);
            });
        }, 210);

    });
    
}