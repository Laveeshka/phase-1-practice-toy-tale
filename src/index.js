let addToy = false;
let toyCollection = document.querySelector("#toy-collection");
const addBtn = document.querySelector("#new-toy-btn");
let toysUrl = "http://localhost:3000/toys";

document.addEventListener("DOMContentLoaded", () => {
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetchAndyToys();
  addNewToy();
});

function fetchAndyToys(){
  fetch(toysUrl)
    .then(res => res.json())
    .then(toyData => {
      console.log(toyData);
      toyData.forEach(toy => createCard(toy));
    })
    .catch(err => console.log(err.message));
}

function createCard(toy){
    let card = document.createElement("div");
    card.classList.add("card");
    let h2 = document.createElement("h2");
    h2.innerText = toy.name;
    let img = document.createElement("img");
    img.classList.add("toy-avatar");
    img.setAttribute("src", toy.image);
    let p = document.createElement("p");
    p.innerText = `${toy.likes} Likes`;
    let button = document.createElement("button");
    button.classList.add("like-btn");
    button.setAttribute("id", toy.id);
    button.innerText = "Like ❤️";

    //listen to click event on button
    button.addEventListener("click", increaseToyLikes);

    card.append(h2, img, p, button);
    toyCollection.appendChild(card);
}

function addNewToy(){
  const form = document.querySelector(".add-toy-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameInput = document.querySelector('input[name="name"]');
    //console.log(nameInput.value);
    const imageInput = document.querySelector('input[name="image"]');
    //console.log(imageInput.value);
    let newToy = {
      "name": nameInput.value,
      "image": imageInput.value,
      "likes": 0
    }
    console.log(newToy);

    fetch(toysUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(res => res.json())
      .then(data => createCard(data))
  });
}


function increaseToyLikes(event){
  event.preventDefault();
  console.log(event.target.id);
  let pContent = event.target.previousElementSibling.innerText;
  let pContentInt = parseInt(pContent);
  let newLikes = pContentInt + 1;
  //console.log(newLikes);
  fetch(`${toysUrl}/${event.target.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": newLikes
    }
    )
  })
  .then(res => res.json())
  .then(obj => {
    console.log(obj.likes);
    event.target.previousElementSibling.innerText = `${obj.likes} likes`;
  })
}
