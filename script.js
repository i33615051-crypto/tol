// ВСТАВЬ СВОИ ДАННЫЕ ТУТ:
const APP_URL = "https://script.google.com/macros/s/AKfycbw0VDa2oMGPh8nSGCIWRf3_AQNbzmOgtOzJCcC1t1JJc2Nlt9Uee8QVJoYd-T7ptgJPrg/exec"; 
const SHEET_ID = "18Sx9okx8my4y-xRLBkc1LuOiumMsgPIBLaeTY1ouBZ8";

// 1. Вход и Регистрация
async function auth(type) {
    const user = document.getElementById('user-login').value;
    const pass = document.getElementById('user-pass').value;

    if(!user || !pass) return alert("Пожалуйста, заполните поля!");

    // Отправляем данные (включая ID таблицы)
    await fetch(APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({
            type: type,
            username: user,
            password: pass,
            sheetId: SHEET_ID
        })
    });

    localStorage.setItem('sessionUser', user);
    initWall();
}

// 2. Загрузка сообщений
async function loadMessages() {
    const res = await fetch(`${APP_URL}?sheetId=${SHEET_ID}`);
    const data = await res.json();
    const list = document.getElementById('messages-list');
    
    list.innerHTML = data.length ? data.reverse().map(row => `
        <div style="border-bottom:1px dashed #ccc; margin-bottom:10px;">
            <b>${row[0]}</b>: ${row[1]} <br>
            <small>${new Date(row[2]).toLocaleString()}</small>
        </div>
    `).join('') : "Стена пуста";
}

// 3. Публикация
async function postMsg() {
    const text = document.getElementById('msg-text').value;
    const author = localStorage.getItem('sessionUser');

    await fetch(APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({
            type: 'comment',
            author: author,
            text: text,
            sheetId: SHEET_ID
        })
    });

    document.getElementById('msg-text').value = "";
    alert("Готово! Сообщение скоро появится.");
    setTimeout(loadMessages, 500);
}

// Показ стены
function initWall() {
    const user = localStorage.getItem('sessionUser');
    if(user) {
        document.getElementById('auth-block').style.display = 'none';
        document.getElementById('wall-block').style.display = 'block';
        document.getElementById('greeting').innerText = "Добро пожаловать, " + user;
        loadMessages();
    }
}

function logout() {
    localStorage.removeItem('sessionUser');
    location.reload();
}

// Проверка сессии при запуске
if(localStorage.getItem('sessionUser')) initWall();
