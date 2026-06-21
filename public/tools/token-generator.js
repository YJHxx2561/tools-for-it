const TOKEN_GENERATORS = {
    'random-hex': () => {
        const len = parseInt($('#token-length').value) || 32;
        return arrayToHex(generateRandomBytes(len));
    },
    'random-bytes': () => {
        const len = parseInt($('#token-length').value) || 32;
        return arrayToBase64(generateRandomBytes(len));
    },
    'secure-token': () => {
        const len = parseInt($('#token-length').value) || 32;
        return arrayToBase64Url(generateRandomBytes(len));
    },
    'nano-id': () => {
        const len = parseInt($('#nano-length').value) || 21;
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
        const bytes = generateRandomBytes(len);
        return Array.from(bytes).map(b => alphabet[b % alphabet.length]).join('');
    },
    'uuid4': () => {
        const bytes = generateRandomBytes(16);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = arrayToHex(bytes);
        return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
    },
    'jwt': () => {
        const header = generateJWTPart({ alg: 'HS256', typ: 'JWT' });
        const payload = generateJWTPart({
            sub: '1234567890',
            name: 'User',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600
        });
        const signature = arrayToBase64Url(generateRandomBytes(32));
        return `${header}.${payload}.${signature}`;
    }
};

function renderTokenGenerator() {
    return `
        <div class="tool-card">
            <h3>配置</h3>
            ${selectField('token-type', '令牌类型', [
                { value: 'random-hex', label: '随机十六进制' },
                { value: 'random-bytes', label: '随机字节 (Base64)' },
                { value: 'secure-token', label: '安全令牌 (Base64URL)' },
                { value: 'nano-id', label: 'Nano ID' },
                { value: 'uuid4', label: 'UUID v4' },
                { value: 'jwt', label: 'JWT 令牌' }
            ])}
            <div class="two-col">
                <div>
                    ${inputField('token-length', '长度 (字节)', '32')}
                </div>
                <div>
                    ${inputField('nano-length', 'Nano ID 长度', '21')}
                </div>
            </div>
            <div class="form-group">
                <label>生成数量</label>
                <input type="number" id="token-count" value="1" min="1" max="100">
            </div>
        </div>
        <div class="tool-card">
            <h3>生成结果</h3>
            <div class="result-list" id="token-result">
                <div class="result-placeholder">点击生成按钮获取令牌</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('生成', "generateTokens()")}
            ${button('复制全部', "copyAllResults('token-result')", 'secondary')}
        </div>
    `;
}

function generateTokens() {
    const type = $('#token-type').value;
    const count = parseInt($('#token-count').value) || 1;
    const generator = TOKEN_GENERATORS[type];
    
    const results = [];
    for (let i = 0; i < Math.min(count, 100); i++) {
        results.push(generator());
    }
    
    let html = '';
    for (const result of results) {
        html += `<div class="result-item">
            <span class="result-text">${result}</span>
            <button class="copy-btn" onclick="copyToClipboard('${result}', this)">复制</button>
        </div>`;
    }
    
    $('#token-result').innerHTML = html;
}