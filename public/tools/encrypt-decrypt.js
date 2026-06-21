function renderEncryptDecrypt() {
    return `
        <div class="tool-card">
            <h3>输入</h3>
            <div class="form-group">
                <textarea id="enc-input" placeholder="输入要加密或解密的文本..."></textarea>
            </div>
            <div class="form-group">
                <label>密钥</label>
                <input type="password" id="enc-key" placeholder="输入密钥...">
            </div>
        </div>
        <div class="tool-card">
            <h3>操作</h3>
            <div style="display: flex; gap: 12px;">
                ${button('Base64 编码', "base64Encode()", 'primary')}
                ${button('Base64 解码', "base64Decode()", 'primary')}
                ${button('URL 编码', "urlEncode()", 'primary')}
                ${button('URL 解码', "urlDecode()", 'primary')}
            </div>
        </div>
        <div class="tool-card">
            <h3>结果</h3>
            <div class="result-box" id="enc-result" style="min-height: 100px;">等待操作...</div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('复制结果', "copyToClipboard($('#enc-result').textContent, this)", 'secondary')}
            ${button('清空', "clearEncrypt()", 'secondary')}
        </div>
    `;
}

function base64Encode() {
    try {
        const text = $('#enc-input').value;
        $('#enc-result').textContent = btoa(unescape(encodeURIComponent(text)));
    } catch (e) {
        $('#enc-result').textContent = '编码错误: ' + e.message;
    }
}

function base64Decode() {
    try {
        const text = $('#enc-input').value;
        $('#enc-result').textContent = decodeURIComponent(escape(atob(text)));
    } catch (e) {
        $('#enc-result').textContent = '解码错误: 无效的 Base64 字符串';
    }
}

function urlEncode() {
    try {
        const text = $('#enc-input').value;
        $('#enc-result').textContent = encodeURIComponent(text);
    } catch (e) {
        $('#enc-result').textContent = '编码错误: ' + e.message;
    }
}

function urlDecode() {
    try {
        const text = $('#enc-input').value;
        $('#enc-result').textContent = decodeURIComponent(text);
    } catch (e) {
        $('#enc-result').textContent = '解码错误: 无效的 URL 编码字符串';
    }
}

function clearEncrypt() {
    $('#enc-input').value = '';
    $('#enc-key').value = '';
    $('#enc-result').textContent = '等待操作...';
}
