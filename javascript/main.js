// 1. Search
var UI = {};
UI.EnterPress = function () {
  var input = document.querySelector(".js-search");
  input.addEventListener("keyup", function (e) {
    if (e.which === 13) {
      var value = document.querySelector(".js-search").value;
      document.querySelector('.js-search-results').innerHTML = ''
      SoundcloudAPI.getTrack(value);
    }
  });
};
UI.SubmitClick = function () {
  document.querySelector(".js-submit").addEventListener("click", function () {
    var value = document.querySelector(".js-search").value;
    SoundcloudAPI.getTrack(value);
  });
};
UI.SubmitClick();
UI.EnterPress();
// Query the soundcloud API
var SoundcloudAPI = {};
SoundcloudAPI.init = function () {
  SC.initialize({
    client_id: "cd9be64eeb32d1741c17cb39e41d254d",
  });
};
SoundcloudAPI.init();
SoundcloudAPI.getTrack = function (inputValue) {
  SC.get("/tracks", {
    q: inputValue,
  }).then(function (tracks) {
    console.log(tracks);
    SoundcloudAPI.renderTracks(tracks);
  });
};
// Display the cards

SoundcloudAPI.renderTracks = function (tracks) {
  tracks.forEach(function (track) {
    // card
    var card = document.createElement("div");
    document
      .querySelector(".js-search-results")
      .appendChild(card)
      .classList.add("card");
    // img
    var imgdiv = document.createElement("div");
    imgdiv.classList.add("image");
    var img_image = document.createElement("img");
    img_image.classList.add("image_img");
    img_image.src =
      track.artwork_url || `http://lorempixel.com/100/100/abstract/`;
    imgdiv.appendChild(img_image);
    // content
    var content = document.createElement("div");
    content.classList.add("content");
    var header = document.createElement("div");
    header.classList.add("header");
    header.innerHTML =
      `<a href="${track.permalink_url}" target="_blank">` +
      track.title +
      "</a>";
    var btn = document.createElement("div");
    btn.classList.add("ui", "bottom", "attached", "button", "js-button");
    var icon = document.createElement("i");
    icon.classList.add("add", "icon");
    var span = document.createElement("span");
    span.innerHTML = "Add to playlist";
    content.appendChild(header);
    btn.appendChild(icon);
    btn.appendChild(span);
    card.appendChild(imgdiv);
    card.appendChild(content);
    card.appendChild(btn);
    btn.addEventListener("click", function () {
      SoundcloudAPI.getEmbed(track.permalink_url);
    });
    var result_search = document.querySelector(".js-search-results");
    result_search.appendChild(card);
  });
};

//Add to playlist and play

SoundcloudAPI.getEmbed = function (trackURL) {
  SC.oEmbed(trackURL, {
    auto_play: true,
  }).then(function (embed) {
    console.log("oEmbed response: ", embed);
    var sidebar = document.querySelector(".js-playlist");
    var box = document.createElement("div");
    box.innerHTML = embed.html;
    sidebar.insertBefore(box, sidebar.firstChild);
    localStorage.setItem("key", sidebar.innerHTML);
  });
};
var sidebar = document.querySelector(".js-playlist");
sidebar.innerHTML = localStorage.getItem("key");
function remove(){
  localStorage.clear();
  sidebar.innerHTML = " "
  alert("Playlist cleared")
}