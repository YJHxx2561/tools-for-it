function $(selector) {
    return document.querySelector(selector);
}

function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '已复制!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = '复制';
            btn.classList.remove('copied');
        }, 1500);
    });
}

function copyResultById(id, btn) {
    const el = document.getElementById(id);
    if (el) {
        copyToClipboard(el.textContent, btn);
    }
}

function copyAllResults(containerId) {
    const container = document.getElementById(containerId);
    const items = container.querySelectorAll('.result-text');
    const texts = Array.from(items).map(item => item.textContent);
    const allText = texts.join('\n');
    
    navigator.clipboard.writeText(allText).then(() => {
        const btn = event.target;
        btn.textContent = '已复制全部!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = '复制全部';
            btn.classList.remove('copied');
        }, 1500);
    });
}

function generateSection(title, content, btnText = '复制') {
    return `<div class="output-section">
        <h4>${title}</h4>
        <div class="result-box">
            ${content}
            <button class="btn copy-btn" onclick="copyToClipboard(this.previousSibling.textContent.trim(), this)">${btnText}</button>
        </div>
    </div>`;
}

function inputField(id, label, placeholder, type = 'text') {
    return `<div class="form-group">
        <label for="${id}">${label}</label>
        <input type="${type}" id="${id}" placeholder="${placeholder}">
    </div>`;
}

function selectField(id, label, options) {
    const opts = options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
    return `<div class="form-group">
        <label for="${id}">${label}</label>
        <select id="${id}">${opts}</select>
    </div>`;
}

function button(text, onclick, className = 'btn-primary') {
    return `<button class="btn btn-${className}" onclick="${onclick}">${text}</button>`;
}

function generateRandomBytes(length) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return array;
}

function arrayToHex(array) {
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

function arrayToBase64(array) {
    return btoa(String.fromCharCode(...array));
}

function arrayToBase64Url(array) {
    return arrayToBase64(array).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function generateJWTPart(data) {
    return arrayToBase64Url(new TextEncoder().encode(JSON.stringify(data)));
}

async function fetchWithBackupKey(url) {
    const backupKey = '858139894792cf4b9d0379251da9131b';
    let response = await fetch(url);
    let data = await response.json();

    const rateLimitMessages = ['频次', '过快', '频率', '超限', '限制', '次数', '请求'];
    const isRateLimitError = data.code === 400 && data.msg && 
        rateLimitMessages.some(msg => data.msg.includes(msg));

    if (isRateLimitError) {
        const backupUrl = url.replace(/key=88888888/g, 'key=' + backupKey);
        response = await fetch(backupUrl);
        data = await response.json();
    }

    return data;
}
