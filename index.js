//api
const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";

const data = [];
let filteredFriends = []
const dataPanel = document.querySelector("#data-panel");

//count
const counts = document.querySelector("#count");
let x = 0
const list = JSON.parse(localStorage.getItem('favoriteFriends')) || []
const count = JSON.parse(localStorage.getItem('favoriteCount')) || []

//search
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

//paging
const paginator = document.querySelector('#paginator')
const FRIENDS_PER_PAGE = 12
// 把card dom出來
function renderFriendsList(info) {
  let rawHTML = "";
  info.forEach((friend) => {
    rawHTML += `<div class="card m-2">
      <div class="card">
        <img src="${friend.avatar}" class="card-img-top " alt="friends Poster">
        <div class="card-body">
          <h5 class="card-title">${friend.name}<br>${friend.surname}</h5>
        </div>
        <div class="card-footer">
        <div class="d-flex flex-row-reverse bd-highlight">
          <button class="btn btn-info btn-add-favorite m-1"  data-id="${friend.id}" title="關注"><i class="fa-brands fa-gratipay" data-id="${friend.id}" ></i></button>

          <button class="btn btn-primary btn-show-friends m-1" data-bs-toggle="modal" data-bs-target="#personal-info" data-id="${friend.id}" ><i class="fa-solid fa-circle-info" data-bs-toggle="modal" data-bs-target="#personal-info" data-id="${friend.id}"></i></button>
        </div>
        </div>
      </div>
  </div>`;
  });
  dataPanel.innerHTML = rawHTML;
  counts.innerHTML = `<h6 style="color:white;width:23px;
  height:15px;padding-left:5px">
       ${count.length}</h6>`
}

axios
  .get(INDEX_URL)
  .then(response => {
    data.push(...response.data.results)

    renderPaginator(data.length)
    renderFriendsList(getFriendsByPage(1))
  })
  .catch(err => console.log(err))

// dom Modal
function showFriendsModal(id) {
  const modalName = document.querySelector("#friends-modal-title");
  const modalImage = document.querySelector(".friends-modal-image");
  const modalData = document.querySelector("#friends-modal-data");
  // 先將 modal 內容清空，以免出現上一個 user 的資料殘影
  modalName.textContent = "";
  modalImage.src = "";
  modalData.textContent = "";
  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const user = response.data;

      modalName.textContent = user.name + " " + user.surname;
      modalImage.src = user.avatar;
      modalData.innerHTML = `
      <p>email: ${user.email}</p>
      <p>gender: ${user.gender}</p>
      <p>age: ${user.age}</p>
      <p>region: ${user.region}</p>
      <p>birthday: ${user.birthday}</p>`;
    })
    .catch((error) => console.log(error));
}

// search
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  if (!keyword.length) {
    return alert("請輸入有效字串")
  }
  filteredFriends = data.filter((friend) =>
    friend.name.toLowerCase().includes(keyword) || friend.surname.toLowerCase().includes(keyword)
  )
  if (filteredFriends.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的朋友`)
  }

  renderPaginator(filteredFriends.length)
  renderFriendsList(getFriendsByPage(1))

})

//收藏
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteFriends')) || []
  const count = JSON.parse(localStorage.getItem('favoriteCount')) || []
  let friend = data.find((friend) => friend.id === id)
  if (list.some((friend) => friend.id === id)) {
    return alert('此朋友已經在收藏清單中！')
  } else {
    alert('成功加入！')
    count.push(x++)
  }
  list.push(friend)

  localStorage.setItem('favoriteFriends', JSON.stringify(list))
  localStorage.setItem('favoriteCount', JSON.stringify(count))

  counts.innerHTML = `<h6 style="color:white;width:23px;
  height:15px;padding-left:5px">
       ${count.length}</h6>`
}

//paging
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / FRIENDS_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}
function getFriendsByPage(page) {
  const which = filteredFriends.length ? filteredFriends : data
  const startIndex = (page - 1) * FRIENDS_PER_PAGE
  return which.slice(startIndex, startIndex + FRIENDS_PER_PAGE)
}

// paginator event
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return

  const page = Number(event.target.dataset.page)
  renderFriendsList(getFriendsByPage(page))
})

//info event
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-friends')) {
    showFriendsModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.fa-solid')) {
    showFriendsModal(Number(event.target.dataset.id))
    //新增以下收藏
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  } else if (event.target.matches('.fa-brands')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})



// 點擊小愛心
var hearts = [];
window.requestAnimationFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      setTimeout(callback, 1000 / 60);
    }
  );
})();

init();

function init() {
  css(
    ".heart{width: 10px;height: 10px;position: fixed;background: #f00;transform: rotate(45deg);-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%;position: absolute;}.heart:after{top: -5px;}.heart:before{left: -5px;}"
  );
  attachEvent();
  gameloop();
}

function gameloop() {
  for (var i = 0; i < hearts.length; i++) {
    if (hearts[i].alpha <= 0) {
      document.body.removeChild(hearts[i].el);
      hearts.splice(i, 1);
      continue;
    }

    hearts[i].y--;
    hearts[i].scale += 0.004;
    hearts[i].alpha -= 0.013;
    hearts[i].el.style.cssText =
      "left:" +
      hearts[i].x +
      "px;top:" +
      hearts[i].y +
      "px;opacity:" +
      hearts[i].alpha +
      ";transform:scale(" +
      hearts[i].scale +
      "," +
      hearts[i].scale +
      ") rotate(45deg);background:" +
      hearts[i].color;
  }

  requestAnimationFrame(gameloop);
}

function attachEvent() {
  var old = typeof window.onclick === "function" && window.onclick;
  window.onclick = function (event) {
    old && old();
    createHeart({ x: event.clientX, y: event.clientY });
  };
}

function createHeart({ x, y }) {
  var d = document.createElement("div");
  d.className = "heart";
  hearts.push({
    el: d,
    x: x - 5,
    y: y - 5,
    scale: 1,
    alpha: 1,
    color: randomColor()
  });

  document.body.appendChild(d);
}

function css(css) {
  var style = document.createElement("style");
  style.type = "text/css";
  try {
    style.appendChild(document.createTextNode(css));
  } catch (ex) {
    style.styleSheet.cssText = css;
  }

  document.getElementsByTagName("head")[0].appendChild(style);
}

function randomColor() {
  return (
    "rgb(" +
    ~~(Math.random() * 255) +
    "," +
    ~~(Math.random() * 255) +
    "," +
    ~~(Math.random() * 255) +
    ")"
  );
}
