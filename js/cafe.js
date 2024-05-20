const menuArr = [
    {
        kor_name: '유자 민트 티',
        eng_name: 'Yuja Mint Tea',
        price: 2000
    },
    {
        kor_name: '자몽 허니 블랙티',
        eng_name: 'Grapefruit Honey Black Tea',
        price: 3000
    },
    {
        kor_name: '레몬 캐모마일 블랜드 티',
        eng_name: 'Lemon Chamomile Blend Tea',
        price: 4000
    },
    {
        kor_name: '클래식 밀크티',
        eng_name: 'Classic Milk Tea',
        price: 5000
    },
];

const menuLists = document.querySelector(".menu_lists");

menuArr.forEach(arr => {
    menuLists.innerHTML += `<dl>
            <dt class="name">${arr.kor_name}</dt>
            <dt class="eng_name">${arr.eng_name}</dt>s
            <dt class="price">${arr.price.toLocaleString()}원</dt>
        </dl>
    `
});

const menuList = document.querySelectorAll(".menu_lists dl");
const counterModal = document.querySelector(".counter_modal");
const orderLists = document.querySelector(".receive_lists");
const decreaseBtn = document.querySelector(".decrease");
const increaseBtn = document.querySelector(".increase");
const orderBtn = document.querySelector(".order_btn");
const modalAmount = document.querySelector(".modal_amount");

let orderMenuArr = JSON.parse(localStorage.getItem("orderMenu")) || [];
let count = 1;
let clickedMenu;
let orderState;
let emptyMessage = "원하시는 메뉴를 추가해주세요😉";

const decrease = () => {
    count > 0 ? count-- : alert("수량이 0보다 커야합니다.");
    modalAmount.innerHTML = count;
};

const increase = () => {
    count++;
    modalAmount.innerHTML = count;
};

const menuClickHandler = (index) => {
    const menu = menuArr[index];

    // 중복 메뉴 담기 방지
    const sameMenuFind = orderMenuArr.some(same => menu.kor_name === same.kor_name);
    if (sameMenuFind) {
        return alert("주문창에 이미 같은 메뉴가 존재합니다. 주문창에서 수량을 추가해주세요.");
    }

    const selectConfirm = confirm(`${menu.kor_name}을(를) 주문하시겠습니까?`);

    if (selectConfirm) {
        clickedMenu = menu;
        openModal();
    };
};

const openModal = () => {
    counterModal.style.display = 'block';
    decreaseBtn.addEventListener("click", decrease);
    increaseBtn.addEventListener("click", increase);
};

const handleClickedMenu = () => {
    // 배열에 클릭 데이터 푸시
    orderMenuArr.push({
        kor_name: clickedMenu.kor_name,
        price: clickedMenu.price,
        count: count,
    });

    // 업데이트, 주문추가
    localStorage.setItem("orderMenu", JSON.stringify(orderMenuArr));
    addOrderToDom(clickedMenu, count);

    // 모달 수량 초기화
    count = 1;
    modalAmount.innerHTML = count;

    // 새로 추가된 요소에 이벤트 핸들러 바인딩
    bindOrderBtns();
}

// 메뉴 클릭 이벤트
for (let i = 0; i < menuList.length; i++) {
    menuList[i].addEventListener("click", () => menuClickHandler(i));
};

// 모달 주문 버튼 클릭 이벤트
orderBtn.addEventListener("click", () => handleClickedMenu());

const addOrderToDom = (menu, orderCount) => {
    counterModal.style.display = 'none';

    if (menu !== null) {
        orderState = orderLists.innerHTML += `
            <li class="receive_list">
                <span>${menu.kor_name}</span>
                <div class="receive_wrap">
                    수량:
                    <button class="order_decrease">-</button>
                    <span class="order_count">${orderCount}</span>
                    <button class="order_increase">+</button>
                    <span class="order_amount">${(menu.price * orderCount).toLocaleString()}원</span>
                </div>
                <button class="delete_btn">삭제</button>
            </li>`
    };
};

// 업데이트된 로컬스토리지 데이터 렌더링
const orderedMenu = () => {
    if (orderMenuArr.length !== 0) {
        orderMenuArr.forEach(menu => addOrderToDom(menu, menu.count));
    } else {
        orderState = orderLists.innerHTML = emptyMessage;
    }
};
orderedMenu();

const cancleBtn = document.querySelector(".cancle_btn");

const totalOrderPrice = () => {
    const totalPrice = document.querySelector(".total_price");

    const totalCountSum = orderMenuArr.reduce((acc, cur) => {
        return acc + cur.count;
    }, 0);
    const totalPriceSum = orderMenuArr.reduce((acc, cur) => {
        return acc + cur.price;
    }, 0);

    // 총 주문 가격
    totalPrice.innerText = `총 주문 가격: ${(totalCountSum * totalPriceSum).toLocaleString()}원`;
};

// 이벤트 핸들러 바인딩 함수
const bindOrderBtns = () => {
    const orderDecrease = document.querySelectorAll(".order_decrease");
    const orderIncrease = document.querySelectorAll(".order_increase");
    const orderCount = document.querySelectorAll(".order_count");
    const orderAmount = document.querySelectorAll(".order_amount");
    const listDeleteBtn = document.querySelectorAll(".delete_btn");

    orderDecrease.forEach((button, i) => {
        const orderMenu = orderMenuArr[i];
        button.addEventListener("click", () => {
            if (orderMenu.count > 0) {
                orderMenu.count--;
                orderCount[i].innerText = orderMenu.count;
                orderAmount[i].innerText = `${(orderMenu.price * orderMenu.count).toLocaleString()}원`;
                localStorage.setItem("orderMenu", JSON.stringify(orderMenuArr));
                totalOrderPrice();
            } else {
                alert("수량이 0보다 커야합니다.");
            }
        });
    });

    orderIncrease.forEach((button, i) => {
        const orderMenu = orderMenuArr[i];
        button.addEventListener("click", () => {
            orderMenu.count++;
            orderCount[i].innerText = orderMenu.count;
            orderAmount[i].innerText = `${(orderMenu.price * orderMenu.count).toLocaleString()}원`;
            localStorage.setItem("orderMenu", JSON.stringify(orderMenuArr));
            totalOrderPrice();
        });
    });

    // 주문 삭제 이벤트
    listDeleteBtn.forEach((button, i) => {
        button.addEventListener("click", () => {
            orderMenuArr.splice(i, 1);
            localStorage.setItem("orderMenu", JSON.stringify(orderMenuArr));
            button.parentNode.remove();
            if (orderMenuArr.length !== 0) orderState = orderLists.innerHTML = emptyMessage;

            bindOrderBtns(); // 리스트가 변경되었으므로 다시 바인딩
        });
    });
    totalOrderPrice();
};
bindOrderBtns();

const paymentBtn = document.querySelector(".payment_btn");
paymentBtn.addEventListener("click", () => {
    if (orderMenuArr.length !== 0) {
        localStorage.removeItem("orderMenu");
        orderState = orderLists.innerHTML = emptyMessage;
        alert("주문이 완료되었습니다!");
    } else {
        alert("주문할 메뉴를 추가해주세요.")
    }
});

// 모달 취소
cancleBtn.addEventListener("click", () => {
    counterModal.style.display = 'none';
});