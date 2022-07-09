const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const data = JSON.parse(localStorage.getItem('favoriteFriends')) || [];
let filteredFriends = []
const dataPanel = document.querySelector("#data-panel");
const FRIENDS_PER_PAGE = 12
const counts = document.querySelector("#count");
const list = JSON.parse(localStorage.getItem('favoriteFriends')) || []
const count = JSON.parse(localStorage.getItem('favoriteCount')) || []

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const paginator = document.querySelector('#paginator')

// 把card dom出來
function renderFriendsList(data) {
  let rawHTML = "";
  data.forEach((friend) => {
    rawHTML += `<div class="card m-2">
      <div class="card">
        <img src="${friend.avatar}" class="card-img-top " alt="friends Poster">
        <div class="card-body">
          <h5 class="card-title">${friend.name}<br>${friend.surname}</h5>
        </div>
        <div class="card-footer">
        <div class="d-flex flex-row-reverse bd-highlight">
          <button class="btn btn-danger btn-remove-favorite m-1"  data-id="${friend.id}"><i class="fa-solid fa-trash"></i></button>
          <button class="btn btn-primary btn-show-friends m-1" data-bs-toggle="modal" data-bs-target="#personal-info" data-id="${friend.id}" ><i class="fa-solid fa-circle-info"></i></button>

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


// removeFavorite
function removeFavorite(id) {
  if (!data || !data.length) return
  const friendIndex = data.findIndex((friend) => friend.id === id)
  if (friendIndex === -1) return
  data.splice(friendIndex, 1)
  localStorage.setItem('favoriteFriends', JSON.stringify(data))
  count.pop()
  localStorage.setItem('favoriteCount', JSON.stringify(count))

  renderFriendsList(data)

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


dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-friends')) {
    showFriendsModal(Number(event.target.dataset.id))

  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFavorite(Number(event.target.dataset.id))
  }
})

renderPaginator(data.length)
renderFriendsList(getFriendsByPage(1))



