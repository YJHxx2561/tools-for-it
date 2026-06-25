let currentQRType = 'text';

function renderQRCode() {
    return `
        <div class="tool-card">
            <h3>二维码类型</h3>
            <div class="qr-type-menu" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
                <button class="qr-type-btn active" data-type="text" onclick="switchQRType('text')">文本</button>
                <button class="qr-type-btn" data-type="url" onclick="switchQRType('url')">网址</button>
                <button class="qr-type-btn" data-type="wifi" onclick="switchQRType('wifi')">WiFi</button>
                <button class="qr-type-btn" data-type="email" onclick="switchQRType('email')">邮箱</button>
                <button class="qr-type-btn" data-type="phone" onclick="switchQRType('phone')">电话</button>
            </div>
            <div id="qr-input-area">
                ${renderQRInput('text')}
            </div>
            <div class="form-group" style="margin-top: 12px;">
                <label>二维码大小</label>
                <select id="qrcode-size">
                    <option value="150">小 (150x150)</option>
                    <option value="200" selected>中 (200x200)</option>
                    <option value="300">大 (300x300)</option>
                    <option value="400">超大 (400x400)</option>
                </select>
            </div>
        </div>
        <div class="tool-card">
            <h3>二维码预览</h3>
            <div id="qrcode-preview" style="display: flex; align-items: center; justify-content: center; min-height: 200px;">
                <div class="result-placeholder">输入内容后点击生成按钮</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('生成二维码', "generateQRCode()")}
            ${button('下载二维码', "downloadQRCode()", 'secondary')}
        </div>
    `;
}

function switchQRType(type) {
    currentQRType = type;
    
    // 更新按钮状态
    document.querySelectorAll('.qr-type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
    
    // 更新输入区域
    $('#qr-input-area').innerHTML = renderQRInput(type);
}

function renderQRInput(type) {
    if (type === 'wifi') {
        return `
            <div class="form-group">
                <label>WiFi 名称 (SSID)</label>
                <input type="text" id="qr-wifi-ssid" placeholder="输入WiFi名称">
            </div>
            <div class="form-group">
                <label>密码</label>
                <input type="text" id="qr-wifi-password" placeholder="输入WiFi密码">
            </div>
            <div class="form-group">
                <label>加密类型</label>
                <select id="qr-wifi-type">
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">无密码</option>
                </select>
            </div>
        `;
    } else if (type === 'email') {
        return `
            <div class="form-group">
                <label>邮箱地址</label>
                <input type="text" id="qr-email-addr" placeholder="example@email.com">
            </div>
            <div class="form-group">
                <label>主题</label>
                <input type="text" id="qr-email-subject" placeholder="邮件主题（可选）">
            </div>
            <div class="form-group">
                <label>内容</label>
                <textarea id="qr-email-body" placeholder="邮件内容（可选）" rows="3"></textarea>
            </div>
        `;
    } else if (type === 'phone') {
        return `
            <div class="form-group">
                <label>电话号码</label>
                <input type="text" id="qr-phone-number" placeholder="输入电话号码">
            </div>
        `;
    } else if (type === 'url') {
        return `
            <div class="form-group">
                <label>网址</label>
                <input type="text" id="qr-url-text" placeholder="https://example.com">
            </div>
        `;
    } else {
        return `
            <div class="form-group">
                <label>输入文本</label>
                <textarea id="qrcode-input" placeholder="输入要生成二维码的文本..." rows="4"></textarea>
            </div>
        `;
    }
}

function getQRContent() {
    if (currentQRType === 'wifi') {
        const ssid = $('#qr-wifi-ssid').value.trim();
        const password = $('#qr-wifi-password').value.trim();
        const type = $('#qr-wifi-type').value;
        if (!ssid) return '';
        return `WIFI:T:${type};S:${ssid};P:${password};H:false;;`;
    } else if (currentQRType === 'email') {
        const addr = $('#qr-email-addr').value.trim();
        const subject = $('#qr-email-subject').value.trim();
        const body = $('#qr-email-body').value.trim();
        if (!addr) return '';
        let url = `mailto:${addr}`;
        if (subject || body) {
            const params = [];
            if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
            if (body) params.push(`body=${encodeURIComponent(body)}`);
            url += '?' + params.join('&');
        }
        return url;
    } else if (currentQRType === 'phone') {
        const number = $('#qr-phone-number').value.trim();
        if (!number) return '';
        return `tel:${number}`;
    } else if (currentQRType === 'url') {
        return $('#qr-url-text').value.trim();
    } else {
        return $('#qrcode-input').value.trim();
    }
}

function generateQRCode() {
    const text = getQRContent();
    const size = parseInt($('#qrcode-size').value);
    
    if (!text) {
        $('#qrcode-preview').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">请输入内容</div>';
        return;
    }
    
    const encodedText = encodeURIComponent(text);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&bgcolor=ffffff&color=000000&margin=10`;
    
    $('#qrcode-preview').innerHTML = `<img src="${qrUrl}" alt="QR Code" style="max-width: 100%; border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; background: white;" onerror="handleQRCodeError()">`;
}

function handleQRCodeError() {
    $('#qrcode-preview').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">生成失败，请检查网络连接或稍后重试</div>';
}

function downloadQRCode() {
    const img = $('#qrcode-preview').querySelector('img');
    if (!img) {
        alert('请先生成二维码');
        return;
    }
    
    fetch(img.src)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
        })
        .catch(() => {
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = img.src;
            link.target = '_blank';
            link.click();
        });
}
