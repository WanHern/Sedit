/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

// import your own scripts here.
import { login } from './login.js';
import { signup } from './signup.js';
import { publicfeed } from './publicfeed.js';
import { userfeed } from './userfeed.js';
import { profile } from './profile.js';
import { new_post } from './new_post.js';

// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
export function initApp(apiUrl) {

  // INITIALISATION OF PAGE HEADER AND MAIN @@@@@@@@@@@@@@@@@@@@@
  
  // Create header
  let init_header = document.createElement("header");
  init_header.setAttribute("class","banner");
  init_header.setAttribute("id","nav");

  let logo_h = document.createElement("h1");
  logo_h.setAttribute("class","flex-center");
  logo_h.setAttribute("id","logo");
  logo_h.style = "cursor: pointer";
  logo_h.appendChild(document.createTextNode("Seddit"));

  init_header.appendChild(logo_h);

  let nav_ul = document.createElement("ul");
  nav_ul.setAttribute("class","nav");

  let item_li = document.createElement("li");
  item_li.setAttribute('class','nav-item');
  let searchbar = document.createElement("input");
  searchbar.setAttribute('id','search');
  searchbar.setAttribute('data-id-search','');
  searchbar.setAttribute('type','search');
  searchbar.placeholder = "Search Seddit";
  item_li.appendChild(searchbar);
  nav_ul.appendChild(item_li);

  init_header.appendChild(nav_ul);

  document.getElementById("root").appendChild(init_header);

  // Create main
  let main = document.createElement("main");
  main.setAttribute("role","main");

  document.getElementById("root").appendChild(main);

  // CREATE NAV BUTTONS                           @@@@@@@@@@@@@@@
  // LOGIN | SIGNUP | NEW_POST | PROFILE | LOGOUT @@@@@@@@@@@@@@@
  
  // Create login button
  if (!document.getElementById("login-btn")) {
    // Create nav-item list
    let item_l = document.createElement("li");
    item_l.setAttribute('class','nav-item');
    // Create login button
    let login_btn = document.createElement("button");
    login_btn.setAttribute('id','login-btn');
    login_btn.setAttribute('data-id-login','');
    login_btn.setAttribute('class','button button-nav');
    login_btn.style = "cursor:pointer";
    let login = document.createTextNode("Login");
    login_btn.appendChild(login);

    item_l.appendChild(login_btn);

    document.getElementsByClassName("nav")[0].appendChild(item_l);
  }

  // Create signup button
  if (!document.getElementById("signup-btn")) {
    // Create nav-item list
    let item_l = document.createElement("li");
    item_l.setAttribute('class','nav-item');
    // Create signup button
    let signup_btn = document.createElement("button");
    signup_btn.setAttribute('id','signup-btn');
    signup_btn.setAttribute('data-id-signup','');
    signup_btn.setAttribute('class','button button-nav');
    signup_btn.style = "cursor:pointer";
    let signup = document.createTextNode("Sign up");
    signup_btn.appendChild(signup);

    item_l.appendChild(signup_btn);

    document.getElementsByClassName("nav")[0].appendChild(item_l);
  }

  // Create new_post button
  if (!document.getElementById("new_post-btn")) {
    // Create nav-item list
    let item_l = document.createElement("li");
    item_l.setAttribute('class','nav-item');

    // Create new_post button
    let new_post_btn = document.createElement("button");
    new_post_btn.setAttribute('id','new_post-btn');
    new_post_btn.setAttribute('data-id-new_post','');
    new_post_btn.setAttribute('class','button button-nav');
    new_post_btn.style = "display:none; cursor:pointer";
    let new_post = document.createTextNode("+ New post");
    new_post_btn.appendChild(new_post);

    item_l.appendChild(new_post_btn);

    document.getElementsByClassName("nav")[0].appendChild(item_l);
  }

  // Create profile button
  if (!document.getElementById("profile-btn")) {
    // Create nav-item list
    let item_l = document.createElement("li");
    item_l.setAttribute('class','nav-item');
    // Create profile button
    let profile_btn = document.createElement("button");
    profile_btn.setAttribute('id','profile-btn');
    profile_btn.setAttribute('data-id-profile','');
    profile_btn.setAttribute('class','button button-nav');
    profile_btn.style = "display:none; cursor:pointer";
    let profile = document.createTextNode("Profile");
    profile_btn.appendChild(profile);

    item_l.appendChild(profile_btn);

    document.getElementsByClassName("nav")[0].appendChild(item_l);
  }

  // Create logout button
  if (!document.getElementById("logout-btn")) {
    // Create nav-item list
    let item_l = document.createElement("li");
    item_l.setAttribute('class','nav-item');
    // Create button
    let logout_btn = document.createElement("button");
    logout_btn.setAttribute('id','logout-btn');
    logout_btn.setAttribute('data-id-logout','');
    logout_btn.setAttribute('class','button button-nav');
    logout_btn.style = "display:none; cursor:pointer";
    let logout = document.createTextNode("Logout");
    logout_btn.appendChild(logout);

    item_l.appendChild(logout_btn);

    document.getElementsByClassName("nav")[0].appendChild(item_l);
  }

  // EVENT LISTENERS @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  
  // Log in button event listener (click)
  document.getElementById("login-btn").addEventListener("click", function() {
    login(apiUrl);
  });

  // Sign up button event listener (click)
  document.getElementById("signup-btn").addEventListener("click", function() {
    signup(apiUrl);
  });

  // Profile button event listener (click)
  document.getElementById("profile-btn").addEventListener("click", function() {
    // If user is logged in, redirect to profile
    if(localStorage.getItem("token")) {
      profile(apiUrl,localStorage.getItem("token"));
    }
  });

  // New-post button event listener (click)
  document.getElementById("new_post-btn").addEventListener("click", function() {
    // If user is logged in, redirect to new_post
    if(localStorage.getItem("token")) {
      new_post(apiUrl,localStorage.getItem("token"));
    }
  });

  // Logout button event listener (click)
  document.getElementById("logout-btn").addEventListener("click", function() {
    // Show login, signup buttons
    document.getElementById("login-btn").style = "cursor:pointer";
    document.getElementById("signup-btn").style = "cursor:pointer";
    // Hide profile, logout, new_post buttons
    document.getElementById("profile-btn").style = "display:none; cursor:pointer";
    document.getElementById("logout-btn").style = "display:none; cursor:pointer";
    document.getElementById("new_post-btn").style = "display:none; cursor:pointer";
    // If user clicks logout button, update local storage
    if (typeof(Storage) !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("id");
    }
    // Go to publicfeed
    setTimeout(function() {
      publicfeed(apiUrl);
    }, 100);
  });

  // Logo event listener (click)
  document.getElementById("logo").addEventListener("click", function() {
    if (typeof(Storage) !== "undefined") {
      // If user is logged in, go to userfeed
      if(localStorage.getItem("token")) {
        userfeed(apiUrl,localStorage.getItem("token"),localStorage.getItem("username"));
      }
      // If user not logged in, go to publicfeed
      else {
        publicfeed(apiUrl);
      }
    }
  });

  // MODAL @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  // Create modal
  let modal = document.createElement("div");
  modal.id = "modal";
  modal.setAttribute('class','modal');

  let modal_content = document.createElement("div");
  modal_content.setAttribute('class','modal-content');

  let modal_header_div = document.createElement("div");
  modal_header_div.setAttribute('class','modal-header');

  let closebtn = document.createElement("span");
  closebtn.setAttribute('class','closebtn');
  let closebtn_text = document.createTextNode("x");
  closebtn.appendChild(closebtn_text);
  modal_header_div.appendChild(closebtn);

  let modal_header = document.createElement("h2");
  modal_header.setAttribute('id','modalheader');
  let modal_header_text = document.createTextNode("Upvoted by");
  modal_header.appendChild(modal_header_text);
  modal_header_div.appendChild(modal_header);

  let ul = document.createElement("ul");
  ul.setAttribute('id','modal_ul');

  modal_content.appendChild(modal_header_div);
  modal_content.appendChild(ul);
  modal.appendChild(modal_content);
  document.getElementById("root").appendChild(modal);

  // PUBLIC FEED @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  // Start by loading userfeed if logged in
  if(localStorage.getItem("token")) {
    userfeed(apiUrl,localStorage.getItem("token"),localStorage.getItem("username"));
  }
  // Otherwise load publicfeed
  else {
    publicfeed(apiUrl);
  }
}

export default initApp;
