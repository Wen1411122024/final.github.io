let bg = document.getElementById('bg');
let moon = document.getElementById('moon');
let mountain = document.getElementById('mountain');
let road = document.getElementById('road');
let text = document.getElementById('text');
/*使用 document.getElementById 選取頁面中的元素 */

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');
const menuButton = document.querySelector('.menu');
const mobileNav = document.getElementById('nav2');
/*
const宣告一個常數變數，變數的值不會重新被指定
document.querySelectorAll()從HTML文件中選取所有符合條件的元素
sections選取所有的 <section> 區塊
navLinks選取導覽列中的連結
*/

// 平滑滾動
navLinks.forEach(link => {
 link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetSection = document.querySelector(this.getAttribute('href'));
    targetSection.scrollIntoView({
        behavior: 'smooth'
    });
 });
});
/*
forEach()迴圈函數，會遍歷navLinks 中的每一個連結
'click每次'點擊'時執行函數
e代表事件物件
preventDefault()取消連結的預設行為，避免網頁重新載入
this代表目前被點擊的連結 getAttribute('href')取得連結的href屬性值，例如 #About
document.querySelector() 用來選取這個連結對應的區塊。
scrollIntoView()讓選取的區塊滾動到視窗中
behavior: 'smooth'平滑滾動
*/

window.addEventListener('scroll', function () {
    /*window.addEventListener監聽用戶對畫面的操作
    'scroll每次'滾動'時執行函數
    function回調函數，當捲動事件發生時，這個函數會被執行*/

    // 滾動視差 
    let value = window.scrollY;
    bg.style.top = value + 0.5 + 'px';
    moon.style.left = -value + 0.5 + 'px';
    mountain.style.top = -value * 0.15 + 'px';
    road.style.top = value * 0.15 + 'px';
    text.style.top = value * 1 + 'px';
    /*
    value變數，用來存放捲動距離的值
    window.scrollY 取得使用者向下捲動的距離（以像素為單位）
    style.top/left 設定圖片的top/left位移
    value + 0.5根據捲動距離，將圖片向下/向右位移
    value * 0.15 移動速度是捲動距離的 15%。
    'px' 將值轉換成像素單位
    */

    // 監聽滾動事件，切換 active 狀態
    let currentSection = '';
    sections.forEach(section => {
     const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
           currentSection = section.getAttribute('id');
        }
    });
    /*
    currentSection宣告一個變數用來記錄目前滾動到的區塊
    sections.forEach(section遍歷每一個區塊，檢查目前的滾動位置
    offsetTop該區塊距離頁面頂端的高度（像素）
    pageYOffset使用者
    if (pageYOffset >= sectionTop - 60)如果滾動的距離大於或等於該區塊的頂端位置（減去 60px），表示目前滾動到這個區塊
    currentSection = section.getAttribute('id');取得目前區塊的id，並存入currentSection變數中。
    */ 

    navLinks.forEach(link => {
     link.classList.remove('active');
       if (link.getAttribute('href').substring(1) === currentSection) {
        link.classList.add('active');
     }
    });
    /*
    link.classList.remove('active');移除所有連結的active樣式，確保只有目前的區塊會有 active
    link.getAttribute('href')取得導覽列連結的href屬性值，例如#About
    substring(1)去掉#符號，只保留區塊的ID名稱。例如："#About".substring(1) → "About"
    if (link.getAttribute('href').substring(1) === currentSection)如果這個連結的href值等於目前滾動到的區塊 ID
    link.classList.add('active')則為這個連結加上 active class
    */ 
})

// 點擊清單按鈕，切換導覽列的顯示狀態
menuButton.addEventListener('click', () => {
    mobileNav.classList.toggle('active');

    // 切換按鈕的顯示狀態
    if (mobileNav.classList.contains('active')) {
        menuButton.style.visibility = 'hidden';  // 隱藏按鈕
    } else {
        menuButton.style.visibility = 'visible';  // 顯示按鈕
    }
});

// 點擊導覽列中的連結後，自動隱藏導覽列
const navLinks2 = document.querySelectorAll('#nav2 ul li a');
navLinks2.forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        menuButton.style.visibility = 'visible';  // 導覽列收回後重新顯示按鈕
    });
});

// 當螢幕寬度超過 860px 時，自動隱藏導覽列
window.addEventListener('resize', () => {
    if (window.innerWidth > 860) {
        mobileNav.classList.remove('active');
        mobileNav.style.opacity = 0;
        mobileNav.style.visibility = 'hidden';
        menuButton.style.visibility = 'visible';
    }
});

// 從 API 取得資料並顯示在網頁上
fetch("/api/portfolio")
    .then(response => response.json())
    .then(data => {
        const portfolioSection = document.getElementById("portfolio");
        data.forEach(item => {
            const portfolioItem = `
                <div class="portfolio-item">
                    <img src="${item.imgSrc}" alt="${item.title}">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            portfolioSection.innerHTML += portfolioItem;
        });
    })
.catch(error => console.error("Error fetching portfolio:", error));

// 表單提交事件
const uploadForm = document.getElementById("upload-form");
uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 取得表單資料
    const formData = new FormData(uploadForm);
    const newItem = {
        title: formData.get("title"),
        imgSrc: formData.get("imgSrc"),
        description: formData.get("description"),
    };

    // 送出 POST 請求到 API
    try {
        const response = await fetch("/api/portfolio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newItem),
        });

        const result = await response.json();
        alert(result.message);

        // 重新載入作品
        location.reload();
    } catch (error) {
        console.error("Error uploading item:", error);
    }
});

