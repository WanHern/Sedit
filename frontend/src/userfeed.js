export function userfeed(apiUrl,token) {
    // Clear current content
    let content = document.querySelector('[role="main"]');
    while (content.firstChild) {
        content.firstChild.remove();
    }

    // Hide log in and signup buttons
    document.getElementById("login-btn").style = "display:none; cursor:pointer";
    document.getElementById("signup-btn").style = "display:none; cursor:pointer";

    // Display profile, logout and new_post buttons
    document.getElementById("profile-btn").style = "cursor:pointer";
    document.getElementById("logout-btn").style = "cursor:pointer";
    document.getElementById("new_post-btn").style = "cursor:pointer";

    // Create feed ul
    if (!document.getElementById("feed")) {
        let feed_ul = document.createElement("ul");
        feed_ul.setAttribute('id','feed');
        feed_ul.setAttribute('data-id-feed','');
        document.querySelector('[role="main"]').appendChild(feed_ul);
    }

    // To be used for infinite scrolling
    // Set first because it takes time to setItem
    localStorage.setItem("start_post","10");


    // Get user's feed
    let details = {
        method : 'GET',
        headers : {
        'Content-Type': 'application/json',
        'Authorization': 'Token '+token
        }
    }
    fetch(apiUrl + "/user/feed",details)
    .then((res) => {
        if (res.status == 200) {
            res.json()
            .then((data) => {
                for (let i = 0; i < data.posts.length; i++) {
                    // Append posts
                    let post_li = document.createElement("li");
                    post_li.setAttribute('class','post');
                    post_li.setAttribute('data-id-post','');

                    // Upvotes
                    let upvotes_div = document.createElement("div");
                    upvotes_div.setAttribute('class','vote');
                    upvotes_div.setAttribute('data-id-upvotes','');

                    // Upvotes: create upvote arrow
                    let upvote_arrow = document.createElement("div");
                    upvote_arrow.setAttribute('id','upvote_arrow');

                    // Upvotes: check if a post has been upvoted and display accordingly
                    let found = 0;
                    for (let j = 0; j < data.posts[i].meta.upvotes.length; j++) {
                        if (data.posts[i].meta.upvotes[j] == localStorage.getItem("id")) {
                            found = 1;
                        }
                    }
                    if (found == 1) {
                        upvote_arrow.setAttribute('class','upvoted');
                    }
                    else {
                        upvote_arrow.setAttribute('class','not_upvoted');
                    }
                    upvotes_div.appendChild(upvote_arrow);

                    // Upvotes: create a div to hold number of upvotes
                    let upvotes_border = document.createElement("div");
                    upvotes_border.setAttribute('id','upvotes_border');
                    upvotes_border.setAttribute('class','num_upvotes');
                    let upvotes = document.createTextNode(data.posts[i].meta.upvotes.length);
                    upvotes_border.appendChild(upvotes);
                    upvotes_div.appendChild(upvotes_border);
                    post_li.appendChild(upvotes_div);

                    // Upvotes: event listener (to display list of upvoters)
                    if (upvotes_border) {
                        upvotes_border.addEventListener("click", function() {
                            // Clear previous list
                            let content = document.getElementById("modal_ul");
                            document.getElementById("modalheader").innerText = "Upvoted by";
                            while (content.firstChild) {
                                content.firstChild.remove();
                            }
                            for (let j = 0; j < data.posts[i].meta.upvotes.length; j++) {
                                let user_details = {
                                    method : 'GET',
                                    headers : {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Token '+token
                                    }
                                }
                                fetch(apiUrl + "/user?id="+data.posts[i].meta.upvotes[j],details)
                                .then((res) => res.json())
                                .then((data) => {
                                    let username_li = document.createElement("li");
                                    let username = document.createTextNode(data.username);
                                    username_li.appendChild(username);
                                    document.getElementById("modal_ul").appendChild(username_li);
                                });
                            }
                            // Display modal
                            document.getElementById("modal").style = "display:block";
                        });
                        document.getElementsByClassName("closebtn")[0].addEventListener("click", closeModal);
                        window.addEventListener("click",closeModal_background);
                    }

                    // Upvotes: event listener (to upvote or remove upvote)
                    if (upvote_arrow) {
                        upvote_arrow.addEventListener("click", function() {
                            if (upvote_arrow.classList.contains('not_upvoted')) {
                                let vote_details = {
                                    method : 'PUT',
                                    headers : {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Token '+token
                                    }
                                }
                                fetch(apiUrl + "/post/vote?id="+data.posts[i].id, vote_details)
                                .then((res) => res.json())
                                .then((data) => {
                                    upvote_arrow.setAttribute('class','upvoted');
                                });
                            }
                            else {
                                let vote_details = {
                                    method : 'DELETE',
                                    headers : {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Token '+token
                                    }
                                }
                                fetch(apiUrl + "/post/vote?id="+data.posts[i].id, vote_details)
                                .then((res) => res.json())
                                .then((data) => {
                                    upvote_arrow.setAttribute('class','not_upvoted');
                                });
                            }
                        });
                    }

                    // Content div
                    let content_div = document.createElement("div");
                    content_div.setAttribute('class','content');

                    // Subseddit
                    let subseddit_p = document.createElement("p");
                    let subseddit_str = "/s/" + data.posts[i].meta.subseddit;
                    let subseddit = document.createTextNode(subseddit_str);
                    subseddit_p.appendChild(subseddit);

                    content_div.appendChild(subseddit_p);

                    // Title
                    let title_h = document.createElement("h4");
                    title_h.setAttribute('class','post-title alt-text');
                    title_h.setAttribute('data-id-title','');
                    let title = document.createTextNode(data.posts[i].title);
                    title_h.appendChild(title);

                    content_div.appendChild(title_h);

                    // Author and date
                    let author_p = document.createElement("p");
                    author_p.setAttribute('class','post-author');
                    author_p.setAttribute('data-id-author','');
                    let author_str = "Posted by " + data.posts[i].meta.author;
                    let author = document.createTextNode(author_str);
                    author_p.appendChild(author);

                    let date = new Date(data.posts[i].meta.published*1000);
                    let year = date.getFullYear();
                    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                    let month = months[date.getMonth()];
                    let day = date.getDate();
                    let published_str = " on "+day+" "+month+" "+year;
                    let published = document.createTextNode(published_str);
                    author_p.appendChild(published);

                    content_div.appendChild(author_p);

                    // Description text
                    let description_p = document.createElement("p");
                    let description = document.createTextNode(data.posts[i].text);
                    description_p.appendChild(description);

                    content_div.appendChild(description_p);

                    // Image
                    if (data.posts[i].image) {
                        let image_img = document.createElement("img");
                        image_img.setAttribute('style','max-width:100%;height:auto;');
                        let image_str = "data:image/jpeg;base64," + data.posts[i].image;
                        image_img.setAttribute('src',image_str);

                        content_div.appendChild(image_img);
                    }

                    // Comments
                    let comments_p = document.createElement("p");
                    comments_p.setAttribute('class','comment-userfeed');
                    comments_p.setAttribute('id','num_comments');
                    let comments_str = data.posts[i].comments.length + " comments";
                    let comments = document.createTextNode(comments_str);
                    comments_p.appendChild(comments);
                    localStorage.num_comments = data.posts[i].comments.length;

                    content_div.appendChild(comments_p);

                    // Comments: event listener (to display comments)
                    comments_p.addEventListener("click", function() {
                        // Clear previous list
                        let content = document.getElementById("modal_ul");
                        document.getElementById("modalheader").innerText = "Comments";
                        while (content.firstChild) {
                            content.firstChild.remove();
                        }
                        for (let j = 0; j < data.posts[i].comments.length; j++) {
                            let full_comment = document.createElement("p");

                            let date = new Date(data.posts[i].comments[j].published*1000);
                            let year = date.getFullYear();
                            let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                            let month = months[date.getMonth()];
                            let day = date.getDate();
                            let date_str = "("+day+" "+month+" "+year+")";
                            let published_str = document.createTextNode(date_str);

                            let author_b = document.createElement("b");
                            let author = document.createTextNode(data.posts[i].comments[j].author+" ");
                            author_b.appendChild(author);
                            full_comment.appendChild(author_b);
                            full_comment.appendChild(published_str);
                            full_comment.appendChild(document.createElement("br"));

                            let comment_b1 = document.createElement("b1");
                            let comment = document.createTextNode(data.posts[i].comments[j].comment)
                            comment_b1.appendChild(comment);
                            full_comment.appendChild(comment_b1);

                            document.getElementById("modal_ul").appendChild(full_comment);
                        }
                        // Comment box to enter new comment
                        let new_comment = document.createElement("input");
                        new_comment.setAttribute('id','new-comment')
                        new_comment.placeholder = "Write comment...";
                        document.getElementById("modal_ul").appendChild(new_comment);

                        // Submit button
                        let submit_b = document.createElement("btn");
                        submit_b.setAttribute('type','submit');
                        submit_b.setAttribute('id','submit');
                        submit_b.setAttribute('class','button button-submit');
                        submit_b.style = "cursor:pointer; font-size:10px";
                        let submit = document.createTextNode("Post");
                        submit_b.appendChild(submit);
                        document.getElementById("modal_ul").appendChild(submit_b);

                        document.getElementById("submit").addEventListener("click", function() {
                            let comment_str = document.getElementById("new-comment").value;
                            // If comment exists
                            if (comment_str.localeCompare("") != 0) {
                                let comment_details = {
                                    method : 'PUT',
                                    headers : {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Token '+token
                                    },
                                    body : JSON.stringify({
                                    'comment': comment_str
                                    })
                                }
                                fetch(apiUrl + "/post/comment?id="+data.posts[i].id, comment_details)
                                .then((res) => res.json())
                                .then((data) => {
                                    printmsg("Comment added!");
                                });
                            }
                        });

                        // Display modal
                        document.getElementById("modal").style = "display:block";

                        document.getElementsByClassName("closebtn")[0].addEventListener("click", closeModal);
                        window.addEventListener("click",closeModal_background);
                    });

                    post_li.appendChild(content_div);

                    document.getElementById("feed").appendChild(post_li);
                }
            })
        }
        else if (res.status == 403) {
        }
    });

    // Infinite scrolling feature (progressively loads posts as the user scrolls)
    let scrolled = 0;
    window.addEventListener("scroll", function () {
      if (scrolled > 80) {
        scrolled -= 80;
        fetch(apiUrl + "/user/feed?p="+localStorage.getItem("start_post")+"&n=2",details)
            .then((res) => {
            if (res.status == 200) {
                res.json()
                .then((data) => {
                    let start_post = Number(localStorage.getItem("start_post"));
                    start_post += 3;
                    localStorage.setItem("start_post",start_post.toString());
                    for (let i = 0; i < data.posts.length; i++) {
                        // Append posts
                        let post_li = document.createElement("li");
                        post_li.setAttribute('class','post');
                        post_li.setAttribute('data-id-post','');

                        // Upvotes
                        let upvotes_div = document.createElement("div");
                        upvotes_div.setAttribute('class','vote');
                        upvotes_div.setAttribute('data-id-upvotes','');

                        // Upvotes: create upvote arrow
                        let upvote_arrow = document.createElement("div");
                        upvote_arrow.setAttribute('id','upvote_arrow');

                        // Upvotes: check if a post has been upvoted and display accordingly
                        let found = 0;
                        for (let j = 0; j < data.posts[i].meta.upvotes.length; j++) {
                            if (data.posts[i].meta.upvotes[j] == localStorage.getItem("id")) {
                                found = 1;
                            }
                        }
                        if (found == 1) {
                            upvote_arrow.setAttribute('class','upvoted');
                        }
                        else {
                            upvote_arrow.setAttribute('class','not_upvoted');
                        }
                        upvotes_div.appendChild(upvote_arrow);

                        // Upvotes: create a div to hold number of upvotes
                        let upvotes_border = document.createElement("div");
                        upvotes_border.setAttribute('id','upvotes_border');
                        upvotes_border.setAttribute('class','num_upvotes');
                        let upvotes = document.createTextNode(data.posts[i].meta.upvotes.length);
                        upvotes_border.appendChild(upvotes);
                        upvotes_div.appendChild(upvotes_border);
                        post_li.appendChild(upvotes_div);

                        // Upvotes: event listener (to display list of upvoters)
                        if (upvotes_border) {
                            upvotes_border.addEventListener("click", function() {
                                // Clear previous list
                                let content = document.getElementById("modal_ul");
                                document.getElementById("modalheader").innerText = "Upvoted by";
                                while (content.firstChild) {
                                    content.firstChild.remove();
                                }
                                for (let j = 0; j < data.posts[i].meta.upvotes.length; j++) {
                                    let user_details = {
                                        method : 'GET',
                                        headers : {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Token '+token
                                        }
                                    }
                                    fetch(apiUrl + "/user?id="+data.posts[i].meta.upvotes[j],details)
                                    .then((res) => res.json())
                                    .then((data) => {
                                        let username_li = document.createElement("li");
                                        let username = document.createTextNode(data.username);
                                        username_li.appendChild(username);
                                        document.getElementById("modal_ul").appendChild(username_li);
                                    });
                                }
                                // Display modal
                                document.getElementById("modal").style = "display:block";
                            });
                            document.getElementsByClassName("closebtn")[0].addEventListener("click", closeModal);
                            window.addEventListener("click",closeModal_background);
                        }

                        // Upvotes: event listener (to upvote or remove upvote)
                        if (upvote_arrow) {
                            upvote_arrow.addEventListener("click", function() {
                                if (upvote_arrow.classList.contains('not_upvoted')) {
                                    let vote_details = {
                                        method : 'PUT',
                                        headers : {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Token '+token
                                        }
                                    }
                                    fetch(apiUrl + "/post/vote?id="+data.posts[i].id, vote_details)
                                    .then((res) => res.json())
                                    .then((data) => {
                                        upvote_arrow.setAttribute('class','upvoted');
                                    });
                                }
                                else {
                                    let vote_details = {
                                        method : 'DELETE',
                                        headers : {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Token '+token
                                        }
                                    }
                                    fetch(apiUrl + "/post/vote?id="+data.posts[i].id, vote_details)
                                    .then((res) => res.json())
                                    .then((data) => {
                                        upvote_arrow.setAttribute('class','not_upvoted');
                                    });
                                }
                            });
                        }

                        // Content div
                        let content_div = document.createElement("div");
                        content_div.setAttribute('class','content');

                        // Subseddit
                        let subseddit_p = document.createElement("p");
                        let subseddit_str = "/s/" + data.posts[i].meta.subseddit;
                        let subseddit = document.createTextNode(subseddit_str);
                        subseddit_p.appendChild(subseddit);

                        content_div.appendChild(subseddit_p);

                        // Title
                        let title_h = document.createElement("h4");
                        title_h.setAttribute('class','post-title alt-text');
                        title_h.setAttribute('data-id-title','');
                        let title = document.createTextNode(data.posts[i].title);
                        title_h.appendChild(title);

                        content_div.appendChild(title_h);

                        // Author and date
                        let author_p = document.createElement("p");
                        author_p.setAttribute('class','post-author');
                        author_p.setAttribute('data-id-author','');
                        let author_str = "Posted by " + data.posts[i].meta.author;
                        let author = document.createTextNode(author_str);
                        author_p.appendChild(author);

                        let date = new Date(data.posts[i].meta.published*1000);
                        let year = date.getFullYear();
                        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                        let month = months[date.getMonth()];
                        let day = date.getDate();
                        let published_str = " on "+day+" "+month+" "+year;
                        let published = document.createTextNode(published_str);
                        author_p.appendChild(published);

                        content_div.appendChild(author_p);

                        // Description text
                        let description_p = document.createElement("p");
                        let description = document.createTextNode(data.posts[i].text);
                        description_p.appendChild(description);

                        content_div.appendChild(description_p);

                        // Image
                        if (data.posts[i].image) {
                            let image_img = document.createElement("img");
                            image_img.setAttribute('style','max-width:100%;height:auto;');
                            let image_str = "data:image/jpeg;base64," + data.posts[i].image;
                            image_img.setAttribute('src',image_str);

                            content_div.appendChild(image_img);
                        }

                        // Comments
                        let comments_p = document.createElement("p");
                        comments_p.setAttribute('class','comment-userfeed');
                        comments_p.setAttribute('id','num_comments');
                        let comments_str = data.posts[i].comments.length + " comments";
                        let comments = document.createTextNode(comments_str);
                        comments_p.appendChild(comments);
                        localStorage.num_comments = data.posts[i].comments.length;

                        content_div.appendChild(comments_p);

                        // Comments: event listener (to display comments)
                        comments_p.addEventListener("click", function() {
                            // Clear previous list
                            let content = document.getElementById("modal_ul");
                            document.getElementById("modalheader").innerText = "Comments";
                            while (content.firstChild) {
                                content.firstChild.remove();
                            }
                            for (let j = 0; j < data.posts[i].comments.length; j++) {
                                let full_comment = document.createElement("p");

                                let date = new Date(data.posts[i].comments[j].published*1000);
                                let year = date.getFullYear();
                                let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                                let month = months[date.getMonth()];
                                let day = date.getDate();
                                let date_str = "("+day+" "+month+" "+year+")";
                                let published_str = document.createTextNode(date_str);

                                let author_b = document.createElement("b");
                                let author = document.createTextNode(data.posts[i].comments[j].author+" ");
                                author_b.appendChild(author);
                                full_comment.appendChild(author_b);
                                full_comment.appendChild(published_str);
                                full_comment.appendChild(document.createElement("br"));

                                let comment_b1 = document.createElement("b1");
                                let comment = document.createTextNode(data.posts[i].comments[j].comment)
                                comment_b1.appendChild(comment);
                                full_comment.appendChild(comment_b1);

                                document.getElementById("modal_ul").appendChild(full_comment);
                            }
                            // Comment box to enter new comment
                            let new_comment = document.createElement("input");
                            new_comment.setAttribute('id','new-comment')
                            new_comment.placeholder = "Write comment...";
                            document.getElementById("modal_ul").appendChild(new_comment);

                            // Submit button
                            let submit_b = document.createElement("btn");
                            submit_b.setAttribute('type','submit');
                            submit_b.setAttribute('id','submit');
                            submit_b.setAttribute('class','button button-submit');
                            submit_b.style = "cursor:pointer; font-size:10px";
                            let submit = document.createTextNode("Post");
                            submit_b.appendChild(submit);
                            document.getElementById("modal_ul").appendChild(submit_b);

                            document.getElementById("submit").addEventListener("click", function() {
                                let comment_str = document.getElementById("new-comment").value;
                                // If comment exists
                                if (comment_str.localeCompare("") != 0) {
                                    let comment_details = {
                                        method : 'PUT',
                                        headers : {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Token '+token
                                        },
                                        body : JSON.stringify({
                                        'comment': comment_str
                                        })
                                    }
                                    fetch(apiUrl + "/post/comment?id="+data.posts[i].id, comment_details)
                                    .then((res) => res.json())
                                    .then((data) => {
                                        printmsg("Comment added!");
                                    });
                                }
                            });

                            // Display modal
                            document.getElementById("modal").style = "display:block";

                            document.getElementsByClassName("closebtn")[0].addEventListener("click", closeModal);
                            window.addEventListener("click",closeModal_background);
                        });

                        post_li.appendChild(content_div);

                        document.getElementById("feed").appendChild(post_li);
                    }
                })
            }
            else if (res.status == 403) {
            }
        });
      }
      scrolled++;
    });

}

// Display a message
function printmsg(msg) {
    let errormsg_p = document.createElement("p");
    errormsg_p.setAttribute('id','errormsg');
    let errormsg = document.createTextNode(msg);
    errormsg_p.appendChild(errormsg);
    document.getElementById("modal_ul").appendChild(errormsg_p);
    setTimeout(function() {
        document.getElementById("errormsg").remove();
    }, 2000);
}

function closeModal() {
    document.getElementById("modal").style = "display:none";
}

function closeModal_background(e) {
    if (e.target == document.getElementById("modal")) {
        document.getElementById("modal").style = "display:none";
    }
}