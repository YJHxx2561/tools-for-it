function renderPasswordGenerator() {
    return `
        <div class="tool-card">
            <h3>配置</h3>
            <div class="two-col">
                <div class="form-group">
                    <label>密码长度</label>
                    <input type="number" id="pwd-length" value="16" min="4" max="128">
                </div>
                <div class="form-group">
                    <label>生成数量</label>
                    <input type="number" id="pwd-count" value="1" min="1" max="100">
                </div>
            </div>
            <div class="form-group">
                <label>字符集</label>
                <div class="checkbox-group">
                    <label class="checkbox-item"><input type="checkbox" id="pwd-upper" checked> 大写字母 (A-Z)</label>
                    <label class="checkbox-item"><input type="checkbox" id="pwd-lower" checked> 小写字母 (a-z)</label>
                    <label class="checkbox-item"><input type="checkbox" id="pwd-number" checked> 数字 (0-9)</label>
                    <label class="checkbox-item"><input type="checkbox" id="pwd-symbol" checked> 符号 (!@#$%...)</label>
                </div>
            </div>
            <div class="form-group">
                <label>排除字符</label>
                <input type="text" id="pwd-exclude" placeholder="如: 0, O, l, 1">
            </div>
        </div>
        <div class="tool-card">
            <h3>生成结果</h3>
            <div class="result-list" id="pwd-result">
                <div class="result-placeholder">点击生成按钮获取密码</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('生成', "generatePasswords()")}
            ${button('复制全部', "copyAllResults('pwd-result')", 'secondary')}
        </div>
    `;
}

function generatePasswords() {
    const length = parseInt($('#pwd-length').value) || 16;
    const count = parseInt($('#pwd-count').value) || 1;
    const useUpper = $('#pwd-upper').checked;
    const useLower = $('#pwd-lower').checked;
    const useNumber = $('#pwd-number').checked;
    const useSymbol = $('#pwd-symbol').checked;
    const exclude = ($('#pwd-exclude').value || '').split('').filter(c => c);
    
    let charset = '';
    if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumber) charset += '0123456789';
    if (useSymbol) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    charset = charset.split('').filter(c => !exclude.includes(c)).join('');
    
    if (charset.length === 0) {
        $('#pwd-result').innerHTML = '<div class="result-placeholder">请至少选择一种字符类型</div>';
        return;
    }
    
    const passwords = [];
    for (let i = 0; i < Math.min(count, 100); i++) {
        const bytes = generateRandomBytes(length);
        let password = '';
        for (let j = 0; j < length; j++) {
            password += charset[bytes[j] % charset.length];
        }
        passwords.push(password);
    }
    
    let html = '';
    for (const pwd of passwords) {
        html += `<div class="result-item">
            <span class="result-text">${pwd}</span>
            <button class="copy-btn" onclick="copyToClipboard('${pwd}', this)">复制</button>
        </div>`;
    }
    
    $('#pwd-result').innerHTML = html;
}