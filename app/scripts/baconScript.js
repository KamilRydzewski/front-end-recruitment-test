const baconImg = document.getElementById("bacon");
const baconContainer = document.querySelector(".bacon-container");

function duplicateBacon() {
  baconContainer.appendChild(baconImg.cloneNode(true));
}
