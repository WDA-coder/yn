document.addEventListener("DOMContentLoaded", () => {
  const openModalBtn = document.getElementById("open-modal-btn");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const modal = document.getElementById("modal");
  const form = document.getElementById("lost-form");
  const itemGrid = document.getElementById("item-grid");

  // 페이지 접속 시 기존 저장 데이터 로드
  loadItems();

  // 모달 제어
  openModalBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));

  // 폼 제출 시 분실물 등록
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("item-name").value;
    const desc = document.getElementById("item-desc").value;
    const password = document.getElementById("item-password").value;
    const file = document.getElementById("item-image").files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const newItem = {
          id: Date.now(), // 고유 ID
          name: name,
          desc: desc,
          password: password, // 본인 확인용 비밀번호
          image: event.target.result
        };

        saveItem(newItem);
        renderCard(newItem);
        
        // 폼 리셋 및 모달 닫기
        form.reset();
        modal.classList.add("hidden");
      };

      reader.readAsDataURL(file);
    }
  });

  // 카드를 화면에 표시하는 함수
  function renderCard(item) {
    const card = document.createElement("div");
    card.className = "item-card";
    card.dataset.id = item.id;

    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="card-body">
        <div class="card-title">${item.name}</div>
        <div class="card-desc">${item.desc}</div>
        <button class="delete-btn">삭제</button>
      </div>
    `;

    // 삭제 버튼 동작 설정
    const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => deleteItem(item.id, item.password));

    itemGrid.prepend(card);
  }

  // 삭제 처리 함수 (비밀번호 확인)
  function deleteItem(id, correctPassword) {
    const inputPassword = prompt("등록 시 입력한 삭제 비밀번호를 입력하세요:");

    if (inputPassword === null) return; // 취소 누른 경우

    if (inputPassword === correctPassword) {
      // 로컬 스토리지 데이터 업데이트
      let items = getItems();
      items = items.filter(item => item.id !== id);
      localStorage.setItem("lostItems", JSON.stringify(items));

      // 화면에서 카드 제거
      const cardToRemove = itemGrid.querySelector(`[data-id="${id}"]`);
      if (cardToRemove) cardToRemove.remove();

      alert("삭제되었습니다.");
    } else {
      alert("비밀번호가 일치하지 않습니다. 작성자만 삭제할 수 있습니다.");
    }
  }

  // 로컬 스토리지에 데이터 저장
  function saveItem(item) {
    const items = getItems();
    items.push(item);
    localStorage.setItem("lostItems", JSON.stringify(items));
  }

  // 저장된 데이터 읽기
  function getItems() {
    return JSON.parse(localStorage.getItem("lostItems")) || [];
  }

  // 저장된 분실물 데이터 불러오기
  function loadItems() {
    const items = getItems();
    items.forEach(renderCard);
  }
});