export function publicfeed(apiUrl) {
    // Clear current content
    let content = document.querySelector('[role="main"]');
    while (content.firstChild) {
        content.firstChild.remove();
    }

    // Create feed ul
    if (!document.getElementById("feed")) {
        let feed_ul = document.createElement("ul");
        feed_ul.setAttribute('id','feed');
        feed_ul.setAttribute('data-id-feed','');
        document.querySelector('[role="main"]').appendChild(feed_ul);
    }

    fetch(apiUrl + "/post/public")
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
                    upvotes_div.appendChild(document.createElement("br"));

                    let upvotes_border = document.createElement("div");
                    upvotes_border.setAttribute('id','upvotes_border');
                    upvotes_border.setAttribute('style','text-align:center');

                    let upvotes = document.createTextNode(data.posts[i].meta.upvotes.length);
                    upvotes_border.appendChild(upvotes);
                    upvotes_div.appendChild(upvotes_border);
                    
                    post_li.appendChild(upvotes_div);

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
                    let title_h = document.createElement("h2");
                    title_h.setAttribute('class','post-title alt-text');
                    title_h.setAttribute('data-id-title','');
                    let title = document.createTextNode(data.posts[i].title);
                    title_h.appendChild(title);

                    content_div.appendChild(title_h);

                    // Author, date
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
                    comments_p.setAttribute('class','comment-publicfeed');
                    let comments_str = data.posts[i].comments.length + " comments";
                    let comments = document.createTextNode(comments_str);
                    comments_p.appendChild(comments);

                    content_div.appendChild(comments_p);

                    post_li.appendChild(content_div);

                    document.getElementById("feed").appendChild(post_li);
                }
            })
        }
        else if (res.status == 403) {
        }
    });

}

// Display a message
function printmsg(msg) {
    let errormsg_p = document.createElement("p");
    errormsg_p.setAttribute('id','errormsg');
    let errormsg = document.createTextNode(msg);
    errormsg_p.appendChild(errormsg);
    document.querySelector('[role="main"]').appendChild(errormsg_p);
    setTimeout(function() {
        document.getElementById("errormsg").remove();
    }, 2000);
}