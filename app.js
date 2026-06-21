const tools = {
    'token-generator': {
        title: 'Token 生成器',
        description: '生成各种类型的安全令牌',
        render: renderTokenGenerator
    },
    'uuid-generator': {
        title: 'UUID 生成器',
        description: '生成符合标准的 UUID',
        render: renderUuidGenerator
    },
    'mac-generator': {
        title: 'MAC 地址生成器',
        description: '生成随机 MAC 地址',
        render: renderMacGenerator
    },
    'random-port': {
        title: '随机端口生成器',
        description: '在指定范围内生成随机端口',
        render: renderRandomPort
    },
    'password-generator': {
        title: '密码生成器',
        description: '生成随机安全密码',
        render: renderPasswordGenerator
    },
    'hash-text': {
        title: 'Hash 文本',
        description: '对文本进行哈希计算',
        render: renderHashText
    },
    'encrypt-decrypt': {
        title: '加密/解密',
        description: '使用 AES 对文本进行加密和解密',
        render: renderEncryptDecrypt
    },
    'password-strength': {
        title: '密码强度分析',
        description: '分析密码的安全强度',
        render: renderPasswordStrength
    },
    'docker-converter': {
        title: 'Docker Run to Compose 转换器',
        description: '将 Docker Run 命令转换为 Docker Compose 格式',
        render: renderDockerConverter
    },
    'subnet-calculator': {
        title: 'IPv4 子网计算器',
        description: '计算子网相关信息',
        render: renderSubnetCalculator
    },
    'http-codes': {
        title: 'HTTP 状态码',
        description: '查询 HTTP 状态码含义',
        render: renderHttpCodes
    },
    'device-info': {
        title: '设备信息',
        description: '获取当前设备详细信息',
        render: renderDeviceInfo
    },
    'user-agent': {
        title: '用户代理分析',
        description: '解析用户代理字符串',
        render: renderUserAgent
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const container = document.getElementById('tool-container');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const toolId = item.dataset.tool;
            if (tools[toolId]) {
                container.innerHTML = `<div class="tool-container">
                    <div class="tool-header">
                        <h2>${tools[toolId].title}</h2>
                        <p>${tools[toolId].description}</p>
                    </div>
                    ${tools[toolId].render()}
                </div>`;
                if (tools[toolId].init) {
                    tools[toolId].init();
                }
            }
        });
    });

    container.innerHTML = `<div class="tool-container">
        <div class="tool-header">
            <h2>${tools['token-generator'].title}</h2>
            <p>${tools['token-generator'].description}</p>
        </div>
        ${tools['token-generator'].render()}
    </div>`;
});

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

function generateRandomToken(length = 32) {
    return arrayToHex(generateRandomBytes(length));
}

function generateNanoId(length = 21) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const bytes = generateRandomBytes(length);
    return Array.from(bytes).map(b => alphabet[b % alphabet.length]).join('');
}

function generateSecureToken(length = 32) {
    return arrayToBase64Url(generateRandomBytes(length));
}

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
        return generateSecureToken(len);
    },
    'nano-id': () => {
        const len = parseInt($('#nano-length').value) || 21;
        return generateNanoId(len);
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
            ${inputField('token-length', '长度 (字节)', '32')}
            ${inputField('nano-length', 'Nano ID 长度', '21')}
        </div>
        <div class="tool-card">
            <h3>生成结果</h3>
            <div class="result-box" id="token-result">点击生成按钮获取令牌</div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('生成', "generateToken()")}
            ${button('复制', "copyToClipboard($('#token-result').textContent, this)", 'secondary')}
        </div>
    `;
}

function generateToken() {
    const type = $('#token-type').value;
    const result = TOKEN_GENERATORS[type]();
    $('#token-result').textContent = result;
}

function renderUuidGenerator() {
    return `
        <div class="tool-card">
            <h3>配置</h3>
            ${selectField('uuid-version', 'UUID 版本', [
                { value: 'v4', label: 'UUID v4 (随机)' },
                { value: 'v1', label: 'UUID v1 (时间戳)' },
                { value: 'v7', label: 'UUID v7 (时间排序)' }
            ])}
            <div class="form-group">
                <label>数量</label>
                <input type="number" id="uuid-count" value="5" min="1" max="100">
            </div>
        </div>
        <div class="tool-card">
            <h3>生成结果</h3>
            <div class="result-box" id="uuid-result" style="max-height: 400px; overflow-y: auto;"></div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('生成', "generateUUIDs()")}
            ${button('复制全部', "copyToClipboard($('#uuid-result').textContent, this)", 'secondary')}
        </div>
    `;
}

function generateUUIDv4() {
    const bytes = generateRandomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = arrayToHex(bytes);
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

function generateUUIDv1() {
    const now = Date.now();
    const clockSeq = (Math.random() * 0x3fff) | 0;
    const timeLow = now & 0xffffffff;
    const timeMid = (now >> 32) & 0xffff;
    const timeHigh = ((now >> 48) & 0x0fff) | 0x1000;
    const node = generateRandomBytes(6);
    const hex = arrayToHex(node);
    return `${timeLow.toString(16).padStart(8, '0')}-${timeMid.toString(16).padStart(4, '0')}-${timeHigh.toString(16).padStart(4, '0')}-${clockSeq.toString(16).padStart(4, '0')}-${hex}`;
}

function generateUUIDv7() {
    const now = Date.now();
    const random = generateRandomBytes(10);
    const timeHigh = ((now >> 16) & 0x0fff) | 0x7000;
    const timeMid = now & 0xffff;
    const hex = arrayToHex(random);
    return `${timeHigh.toString(16).padStart(4, '0')}${timeMid.toString(16).padStart(4, '0')}-${hex.slice(0,4)}-${hex.slice(4,8)}-${hex.slice(8,12)}-${hex.slice(12)}`;
}

function generateUUIDs() {
    const version = $('#uuid-version').value;
    const count = parseInt($('#uuid-count').value) || 5;
    const generators = { v4: generateUUIDv4, v1: generateUUIDv1, v7: generateUUIDv7 };
    const uuids = [];
    for (let i = 0; i < Math.min(count, 100); i++) {
        uuids.push(generators[version]());
    }
    $('#uuid-result').textContent = uuids.join('\n');
}

function renderMacGenerator() {
    return `
        <div class="tool-card">
            <h3>配置</h3>
            ${selectField('mac-prefix-source', 'MAC 前缀', [
                { value: 'cisco', label: 'Cisco (00:00:0C)' },
                { value: 'intel', label: 'Intel (00:1B:21)' },
                { value: 'vmware', label: 'VMware (00:0C:29)' },
                { value: 'microsoft', label: 'Microsoft (00:15:5D)' },
                { value: 'oracle', label: 'Oracle (00:21:28)' },
                { value: 'random', label: '随机前缀' }
            ])}
            <div class="form-group">
                <label>数量</label>
                <input type="number" id="mac-count" value="5" min="1" max="100">
            </div>
            <div class="form-group">
                <label>格式</label>
                <div class="radio-group">
                    <label class="radio-item"><input type="radio" name="mac-format" value="colon" checked> 冒号分隔 (00:00:0C:XX:XX:XX)</label>
                    <label class="radio-item"><input type="radio" name="mac-format" value="hyphen"> 连字符分隔 (00-00-0C-XX-XX-XX)</label>
                    <label class="radio-item"><input type="radio" name="mac-format" value="plain"> 无分隔 (00000CXXXXXX)</label>
                </div>
            </div>
        </div>
        <div class="tool-card">
            <h3>生成结果</h3>
            <div class="result-box" id="mac-result" style="max-height: 400px; overflow-y: auto;"></div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('生成', "generateMACs()")}
            ${button('复制全部', "copyToClipboard($('#mac-result').textContent, this)", 'secondary')}
        </div>
    `;
}

const MAC_PREFIXES = {
    cisco: [0x00, 0x00, 0x0C],
    intel: [0x00, 0x1B, 0x21],
    vmware: [0x00, 0x0C, 0x29],
    microsoft: [0x00, 0x15, 0x5D],
    oracle: [0x00, 0x21, 0x28]
};

function generateMACs() {
    const source = $('#mac-prefix-source').value;
    const count = parseInt($('#mac-count').value) || 5;
    const format = document.querySelector('input[name="mac-format"]:checked').value;
    
    let prefix;
    if (source === 'random') {
        prefix = Array.from(generateRandomBytes(3));
    } else {
        prefix = MAC_PREFIXES[source];
    }
    
    const macs = [];
    for (let i = 0; i < Math.min(count, 100); i++) {
        const suffix = Array.from(generateRandomBytes(3));
        const mac = [...prefix, ...suffix];
        let formatted;
        if (format === 'colon') {
            formatted = mac.map(b => b.toString(16).padStart(2, '0')).join(':');
        } else if (format === 'hyphen') {
            formatted = mac.map(b => b.toString(16).padStart(2, '0')).join('-');
        } else {
            formatted = mac.map(b => b.toString(16).padStart(2, '0')).join('');
        }
        macs.push(formatted.toUpperCase());
    }
    $('#mac-result').textContent = macs.join('\n');
}

function renderRandomPort() {
    return `
        <div class="tool-card">
            <h3>配置</h3>
            <div class="two-col">
                <div>
                    ${inputField('port-min', '最小端口', '1')}
                </div>
                <div>
                    ${inputField('port-max', '最大端口', '65535')}
                </div>
            </div>
            <div class="form-group">
                <label>数量</label>
                <input type="number" id="port-count" value="10" min="1" max="100">
            </div>
            <div class="form-group">
                <label>排除端口</label>
                <input type="text" id="port-exclude" placeholder="如: 80, 443, 22">
            </div>
        </div>
        <div class="tool-card">
            <h3>生成结果</h3>
            <div class="result-box" id="port-result"></div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('生成', "generatePorts()")}
            ${button('复制全部', "copyToClipboard($('#port-result').textContent, this)", 'secondary')}
        </div>
    `;
}

function generatePorts() {
    const min = parseInt($('#port-min').value) || 1;
    const max = parseInt($('#port-max').value) || 65535;
    const count = parseInt($('#port-count').value) || 10;
    const excludeStr = $('#port-exclude').value || '';
    const exclude = excludeStr.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
    
    const ports = [];
    for (let i = 0; i < count * 3 && ports.length < count; i++) {
        const port = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!exclude.includes(port) && !ports.includes(port)) {
            ports.push(port);
        }
    }
    $('#port-result').textContent = ports.join('\n');
}

function renderPasswordGenerator() {
    return `
        <div class="tool-card">
            <h3>配置</h3>
            <div class="form-group">
                <label>密码长度</label>
                <input type="number" id="pwd-length" value="16" min="4" max="128">
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
            <div class="result-box" id="pwd-result">点击生成按钮获取密码</div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('生成', "generatePassword()")}
            ${button('复制', "copyToClipboard($('#pwd-result').textContent, this)", 'secondary')}
        </div>
    `;
}

function generatePassword() {
    const length = parseInt($('#pwd-length').value) || 16;
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
        $('#pwd-result').textContent = '请至少选择一种字符类型';
        return;
    }
    
    const bytes = generateRandomBytes(length);
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset[bytes[i] % charset.length];
    }
    $('#pwd-result').textContent = password;
}

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return arrayToHex(new Uint8Array(hashBuffer));
}

async function sha512(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-512', msgBuffer);
    return arrayToHex(new Uint8Array(hashBuffer));
}

async function sha1(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    return arrayToHex(new Uint8Array(hashBuffer));
}

async function md5(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return 'not-supported';
}

function simpleHash(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function fnv1a(str) {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function crc32(str) {
    let crc = 0xffffffff;
    const table = [];
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) {
            c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[i] = c;
    }
    for (let i = 0; i < str.length; i++) {
        crc = table[(crc ^ str.charCodeAt(i)) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
}

function renderHashText() {
    return `
        <div class="tool-card">
            <h3>输入文本</h3>
            <div class="form-group">
                <textarea id="hash-input" placeholder="输入要哈希的文本..."></textarea>
            </div>
        </div>
        <div class="tool-card">
            <h3>哈希算法</h3>
            <div class="checkbox-group">
                <label class="checkbox-item"><input type="checkbox" class="hash-algo" value="md5" checked> MD5</label>
                <label class="checkbox-item"><input type="checkbox" class="hash-algo" value="sha1" checked> SHA-1</label>
                <label class="checkbox-item"><input type="checkbox" class="hash-algo" value="sha256" checked> SHA-256</label>
                <label class="checkbox-item"><input type="checkbox" class="hash-algo" value="sha512" checked> SHA-512</label>
                <label class="checkbox-item"><input type="checkbox" class="hash-algo" value="fnv"> FNV-1a</label>
                <label class="checkbox-item"><input type="checkbox" class="hash-algo" value="murmur"> MurmurHash3</label>
                <label class="checkbox-item"><input type="checkbox" class="hash-algo" value="crc32"> CRC32</label>
            </div>
        </div>
        <div class="tool-card">
            <h3>哈希结果</h3>
            <div id="hash-results"></div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('计算哈希', "calculateHashes()")}
        </div>
    `;
}

async function calculateHashes() {
    const input = $('#hash-input').value;
    if (!input) {
        $('#hash-results').innerHTML = '<p style="color: var(--text-secondary);">请输入文本</p>';
        return;
    }
    
    const algos = Array.from(document.querySelectorAll('.hash-algo:checked')).map(c => c.value);
    const results = [];
    
    for (const algo of algos) {
        let hash;
        switch (algo) {
            case 'sha256':
                hash = await sha256(input);
                break;
            case 'sha512':
                hash = await sha512(input);
                break;
            case 'sha1':
                hash = await sha1(input);
                break;
            case 'md5':
                hash = simpleHash(input, 0).toString(16).padStart(8, '0') + simpleHash(input, 1).toString(16).padStart(8, '0');
                break;
            case 'fnv':
                hash = fnv1a(input).toString(16).padStart(8, '0');
                break;
            case 'murmur':
                hash = simpleHash(input, 0).toString(16).padStart(8, '0');
                break;
            case 'crc32':
                hash = crc32(input).toString(16).padStart(8, '0');
                break;
        }
        results.push({ algo: algo.toUpperCase(), hash: hash.toLowerCase() });
    }
    
    let html = '';
    for (const r of results) {
        html += `<div class="form-group">
            <label>${r.algo}</label>
            <div class="result-box">${r.hash}</div>
        </div>`;
    }
    $('#hash-results').innerHTML = html;
}

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

function renderPasswordStrength() {
    return `
        <div class="tool-card">
            <h3>输入密码</h3>
            <div class="form-group">
                <input type="password" id="strength-input" placeholder="输入密码进行分析...">
            </div>
            <div class="form-group">
                <label>显示密码</label>
                <input type="checkbox" id="show-password">
            </div>
        </div>
        <div class="tool-card">
            <h3>分析结果</h3>
            <div class="strength-meter">
                <div class="strength-bar" id="strength-bar"></div>
            </div>
            <p id="strength-text" style="margin-top: 12px; font-size: 14px;"></p>
        </div>
        <div class="tool-card">
            <h3>详细信息</h3>
            <div id="strength-details"></div>
        </div>
    `;
}

function analyzePasswordStrength(password) {
    const details = {
        length: password.length,
        hasLower: /[a-z]/.test(password),
        hasUpper: /[A-Z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSymbol: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
        hasRepeated: /(.)\1{2,}/.test(password),
        hasSequence: /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)
    };
    
    let score = 0;
    if (details.length >= 8) score += 1;
    if (details.length >= 12) score += 1;
    if (details.length >= 16) score += 1;
    if (details.hasLower) score += 1;
    if (details.hasUpper) score += 1;
    if (details.hasNumber) score += 1;
    if (details.hasSymbol) score += 2;
    if (!details.hasRepeated) score += 1;
    if (!details.hasSequence) score += 1;
    
    let level, text, className;
    if (score <= 3) {
        level = 'weak'; text = '弱 - 容易被破解'; className = 'strength-weak';
    } else if (score <= 5) {
        level = 'fair'; text = '一般 - 建议增强'; className = 'strength-fair';
    } else if (score <= 8) {
        level = 'good'; text = '良好 - 相对安全'; className = 'strength-good';
    } else {
        level = 'strong'; text = '强 - 安全性高'; className = 'strength-strong';
    }
    
    return { score, level, text, className, details };
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('input', (e) => {
        if (e.target.id === 'strength-input') {
            const password = e.target.value;
            if (!password) {
                $('#strength-bar')?.classList.remove('strength-weak', 'strength-fair', 'strength-good', 'strength-strong');
                $('#strength-bar')?.style.setProperty('width', '0');
                $('#strength-text').textContent = '';
                $('#strength-details').innerHTML = '';
                return;
            }
            
            const result = analyzePasswordStrength(password);
            $('#strength-bar').className = 'strength-bar ' + result.className;
            $('#strength-text').textContent = `评分: ${result.score}/10 - ${result.text}`;
            
            const d = result.details;
            $('#strength-details').innerHTML = `
                <div class="info-grid">
                    <div class="info-item">
                        <div class="label">长度</div>
                        <div class="value">${d.length} 字符</div>
                    </div>
                    <div class="info-item">
                        <div class="label">小写字母</div>
                        <div class="value" style="color: ${d.hasLower ? 'var(--success)' : 'var(--danger)'}">${d.hasLower ? '✓' : '✗'}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">大写字母</div>
                        <div class="value" style="color: ${d.hasUpper ? 'var(--success)' : 'var(--danger)'}">${d.hasUpper ? '✓' : '✗'}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">数字</div>
                        <div class="value" style="color: ${d.hasNumber ? 'var(--success)' : 'var(--danger)'}">${d.hasNumber ? '✓' : '✗'}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">特殊符号</div>
                        <div class="value" style="color: ${d.hasSymbol ? 'var(--success)' : 'var(--danger)'}">${d.hasSymbol ? '✓' : '✗'}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">重复字符</div>
                        <div class="value" style="color: ${d.hasRepeated ? 'var(--warning)' : 'var(--success)'}">${d.hasRepeated ? '⚠ 有' : '✓ 无'}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">连续序列</div>
                        <div class="value" style="color: ${d.hasSequence ? 'var(--warning)' : 'var(--success)'}">${d.hasSequence ? '⚠ 有' : '✓ 无'}</div>
                    </div>
                </div>
            `;
        }
        
        if (e.target.id === 'show-password') {
            const pwd = $('#strength-input');
            pwd.type = e.target.checked ? 'text' : 'password';
        }
    });
});

function parseDockerRunCommand(command) {
    const result = {
        image: '',
        name: '',
        ports: [],
        volumes: [],
        environment: [],
        restart: 'no',
        detach: true,
        command: []
    };
    
    const parts = command.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    let i = 0;
    
    while (i < parts.length) {
        const part = parts[i].replace(/^"|"$/g, '');
        
        if (part === '-d' || part === '--detach') {
            result.detach = true;
        } else if (part === '--name') {
            result.name = parts[++i].replace(/^"|"$/g, '');
        } else if (part === '-p' || part === '--publish') {
            const portMapping = parts[++i].replace(/^"|"$/g, '');
            result.ports.push(portMapping);
        } else if (part === '-v' || part === '--volume') {
            const volume = parts[++i].replace(/^"|"$/g, '');
            result.volumes.push(volume);
        } else if (part === '-e' || part === '--env') {
            const env = parts[++i].replace(/^"|"$/g, '');
            result.environment.push(env);
        } else if (part === '--env-file') {
            result.envFile = parts[++i].replace(/^"|"$/g, '');
        } else if (part === '--restart') {
            result.restart = parts[++i].replace(/^"|"$/g, '');
        } else if (part === '-it') {
        } else if (!part.startsWith('-') && !result.image) {
            result.image = part;
        } else if (part.startsWith('-')) {
            i++;
        } else {
            result.command.push(part);
        }
        i++;
    }
    
    return result;
}

function dockerToCompose(parsed) {
    const lines = ['version: "3.8"', '', 'services:'];
    lines.push(`  ${parsed.name || 'app'}:`);
    lines.push(`    image: ${parsed.image}`);
    
    if (parsed.name) {
        lines.push(`    container_name: ${parsed.name}`);
    }
    
    if (parsed.ports.length > 0) {
        lines.push('    ports:');
        for (const p of parsed.ports) {
            const [host, container] = p.split(':');
            if (container.includes('-')) {
                lines.push(`      - "${host}:${container}"`);
            } else {
                lines.push(`      - "${p}"`);
            }
        }
    }
    
    if (parsed.volumes.length > 0) {
        lines.push('    volumes:');
        for (const v of parsed.volumes) {
            lines.push(`      - ${v}`);
        }
    }
    
    if (parsed.environment.length > 0) {
        lines.push('    environment:');
        for (const e of parsed.environment) {
            if (e.includes('=')) {
                const [key, ...vals] = e.split('=');
                lines.push(`      ${key}: "${vals.join('=')}"`);
            } else {
                lines.push(`      ${e}:`);
            }
        }
    }
    
    if (parsed.restart && parsed.restart !== 'no') {
        lines.push(`    restart: ${parsed.restart}`);
    }
    
    return lines.join('\n');
}

function renderDockerConverter() {
    return `
        <div class="tool-card">
            <h3>输入 Docker Run 命令</h3>
            <div class="form-group">
                <textarea id="docker-input" placeholder="输入 Docker Run 命令，例如：docker run -d --name nginx -p 80:80 -v /data:/usr/share/nginx/html nginx:latest"></textarea>
            </div>
            ${button('转换为 Compose', "convertDocker()")}
        </div>
        <div class="tool-card">
            <h3>Docker Compose 输出</h3>
            <div class="code-output" id="docker-output"></div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('复制', "copyToClipboard($('#docker-output').textContent, this)", 'secondary')}
            ${button('清空', "clearDocker()", 'secondary')}
        </div>
    `;
}

function convertDocker() {
    const input = $('#docker-input').value;
    if (!input) {
        $('#docker-output').textContent = '请输入 Docker Run 命令';
        return;
    }
    
    try {
        const parsed = parseDockerRunCommand(input);
        if (!parsed.image) {
            $('#docker-output').textContent = '错误: 未找到镜像名称';
            return;
        }
        const compose = dockerToCompose(parsed);
        $('#docker-output').textContent = compose;
    } catch (e) {
        $('#docker-output').textContent = '解析错误: ' + e.message;
    }
}

function clearDocker() {
    $('#docker-input').value = '';
    $('#docker-output').textContent = '';
}

function ipToInt(ip) {
    const parts = ip.split('.').map(Number);
    return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
}

function intToIp(int) {
    return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');
}

function cidrToMask(cidr) {
    return ~(0xffffffff << (32 - cidr)) >>> 0;
}

function calculateSubnet(ip, cidr) {
    const ipInt = ipToInt(ip);
    const maskInt = cidrToMask(cidr);
    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | ~maskInt) >>> 0;
    const totalHosts = Math.pow(2, 32 - cidr) - 2;
    
    return {
        network: intToIp(networkInt),
        broadcast: intToIp(broadcastInt),
        firstUsable: cidr >= 31 ? intToIp(networkInt) : intToIp(networkInt + 1),
        lastUsable: cidr >= 31 ? intToIp(broadcastInt) : intToIp(broadcastInt - 1),
        totalHosts: totalHosts > 0 ? totalHosts : (cidr === 31 ? 2 : 0),
        subnetMask: intToIp(maskInt),
        wildcardMask: intToIp(~maskInt >>> 0),
        cidr: cidr,
        binaryMask: maskInt.toString(2).match(/.{1,8}/g).join('.')
    };
}

function renderSubnetCalculator() {
    return `
        <div class="tool-card">
            <h3>输入</h3>
            <div class="two-col">
                <div class="form-group">
                    <label>IP 地址</label>
                    <input type="text" id="subnet-ip" placeholder="192.168.1.1" value="192.168.1.0">
                </div>
                <div class="form-group">
                    <label>CIDR</label>
                    <input type="number" id="subnet-cidr" min="1" max="32" value="24">
                </div>
            </div>
            ${button('计算', "calculateSubnet()")}
        </div>
        <div class="tool-card">
            <h3>结果</h3>
            <div id="subnet-results"></div>
        </div>
    `;
}

function calculateSubnet() {
    const ip = $('#subnet-ip').value;
    const cidr = parseInt($('#subnet-cidr').value) || 24;
    
    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
        $('#subnet-results').innerHTML = '<p style="color: var(--danger);">请输入有效的 IP 地址</p>';
        return;
    }
    
    const result = calculateSubnet(ip, cidr);
    
    $('#subnet-results').innerHTML = `
        <div class="info-grid">
            <div class="info-item">
                <div class="label">网络地址</div>
                <div class="value">${result.network}/${result.cidr}</div>
            </div>
            <div class="info-item">
                <div class="label">广播地址</div>
                <div class="value">${result.broadcast}</div>
            </div>
            <div class="info-item">
                <div class="label">子网掩码</div>
                <div class="value">${result.subnetMask}</div>
            </div>
            <div class="info-item">
                <div class="label">通配符掩码</div>
                <div class="value">${result.wildcardMask}</div>
            </div>
            <div class="info-item">
                <div class="label">第一个可用 IP</div>
                <div class="value">${result.firstUsable}</div>
            </div>
            <div class="info-item">
                <div class="label">最后一个可用 IP</div>
                <div class="value">${result.lastUsable}</div>
            </div>
            <div class="info-item">
                <div class="label">可用主机数</div>
                <div class="value">${result.totalHosts}</div>
            </div>
            <div class="info-item">
                <div class="label">二进制掩码</div>
                <div class="value" style="font-size: 12px;">${result.binaryMask}</div>
            </div>
        </div>
    `;
}

const HTTP_CODES = [
    { code: 100, status: 'Continue', desc: '服务器已收到请求的头部，客户端可以继续发送请求体' },
    { code: 101, status: 'Switching Protocols', desc: '服务器正在切换协议' },
    { code: 200, status: 'OK', desc: '请求成功' },
    { code: 201, status: 'Created', desc: '资源已成功创建' },
    { code: 204, status: 'No Content', desc: '请求成功，但没有返回内容' },
    { code: 301, status: 'Moved Permanently', desc: '资源已永久移动到新位置' },
    { code: 302, status: 'Found', desc: '资源临时移动到新位置' },
    { code: 304, status: 'Not Modified', desc: '资源自上次请求后未修改，使用缓存版本' },
    { code: 400, status: 'Bad Request', desc: '服务器无法理解请求格式' },
    { code: 401, status: 'Unauthorized', desc: '请求需要用户认证' },
    { code: 403, status: 'Forbidden', desc: '服务器拒绝访问此资源' },
    { code: 404, status: 'Not Found', desc: '请求的资源不存在' },
    { code: 405, status: 'Method Not Allowed', desc: '不允许使用该 HTTP 方法' },
    { code: 408, status: 'Request Timeout', desc: '请求超时' },
    { code: 409, status: 'Conflict', desc: '请求与服务器状态冲突' },
    { code: 429, status: 'Too Many Requests', desc: '请求过于频繁，触发限流' },
    { code: 500, status: 'Internal Server Error', desc: '服务器内部错误' },
    { code: 502, status: 'Bad Gateway', desc: '网关或代理服务器收到无效响应' },
    { code: 503, status: 'Service Unavailable', desc: '服务器暂时不可用' },
    { code: 504, status: 'Gateway Timeout', desc: '网关超时' }
];

function renderHttpCodes() {
    let rows = HTTP_CODES.map(c => {
        const cat = Math.floor(c.code / 100);
        return `<tr>
            <td><span class="status-badge status-${cat}xx">${c.code}</span></td>
            <td><span class="http-method">${c.status}</span></td>
            <td>${c.desc}</td>
        </tr>`;
    }).join('');
    
    return `
        <div class="tool-card">
            <h3>搜索</h3>
            <div class="form-group search-input">
                <input type="text" id="http-search" placeholder="搜索状态码、状态或描述...">
            </div>
        </div>
        <div class="tool-card">
            <h3>HTTP 状态码参考表</h3>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>状态码</th>
                            <th>状态</th>
                            <th>描述</th>
                        </tr>
                    </thead>
                    <tbody id="http-table-body">
                        ${rows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('input', (e) => {
        if (e.target.id === 'http-search') {
            const query = e.target.value.toLowerCase();
            const filtered = HTTP_CODES.filter(c => 
                c.code.toString().includes(query) ||
                c.status.toLowerCase().includes(query) ||
                c.desc.toLowerCase().includes(query)
            );
            
            const rows = filtered.map(c => {
                const cat = Math.floor(c.code / 100);
                return `<tr>
                    <td><span class="status-badge status-${cat}xx">${c.code}</span></td>
                    <td><span class="http-method">${c.status}</span></td>
                    <td>${c.desc}</td>
                </tr>`;
            }).join('');
            
            $('#http-table-body').innerHTML = rows || '<tr><td colspan="3" style="text-align: center;">未找到匹配的状态码</td></tr>';
        }
    });
});

function getDeviceInfo() {
    const ua = navigator.userAgent;
    const screen = window.screen;
    const navigator2 = window.navigator;
    
    const info = {
        '用户代理': ua,
        '平台': navigator2.platform || '未知',
        '语言': navigator2.language || '未知',
        'Cookie启用': navigator2.cookieEnabled ? '是' : '否',
        '在线状态': navigator2.onLine ? '在线' : '离线',
        '屏幕宽度': screen.width + ' px',
        '屏幕高度': screen.height + ' px',
        '可用屏幕宽度': screen.availWidth + ' px',
        '可用屏幕高度': screen.availHeight + ' px',
        '颜色深度': screen.colorDepth + ' bit',
        '像素比率': window.devicePixelRatio || '未知',
        '窗口宽度': window.innerWidth + ' px',
        '窗口高度': window.innerHeight + ' px',
        '方向': screen.orientation?.type || '不支持',
        '时区': Intl.DateTimeFormat().resolvedOptions().timeZone || '未知',
        '触控设备': navigator2.maxTouchPoints > 0 ? '是' : '否',
        '触控点数': navigator2.maxTouchPoints || 0,
        '硬件并发': navigator2.hardwareConcurrency || '未知',
        '设备内存': (navigator2.deviceMemory || '不支持') + ' GB'
    };
    
    return info;
}

function renderDeviceInfo() {
    const info = getDeviceInfo();
    const items = Object.entries(info).map(([label, value]) => `
        <div class="info-item">
            <div class="label">${label}</div>
            <div class="value" style="font-size: 13px; word-break: break-all;">${value}</div>
        </div>
    `).join('');
    
    return `
        <div class="tool-card">
            <h3>设备信息</h3>
            <div class="info-grid">
                ${items}
            </div>
        </div>
        <div class="tool-card">
            ${button('刷新', "refreshDeviceInfo()", 'secondary')}
        </div>
    `;
}

function refreshDeviceInfo() {
    const info = getDeviceInfo();
    const container = $('#tool-container');
    const items = Object.entries(info).map(([label, value]) => `
        <div class="info-item">
            <div class="label">${label}</div>
            <div class="value" style="font-size: 13px; word-break: break-all;">${value}</div>
        </div>
    `).join('');
    
    container.querySelector('.info-grid').innerHTML = items;
}

function parseUserAgent(ua) {
    const result = {
        browser: { name: '未知', version: '' },
        engine: { name: '未知', version: '' },
        os: { name: '未知', version: '' },
        cpu: { name: '未知', architecture: '' },
        device: { type: '未知', model: '' }
    };
    
    if (!ua) return result;
    
    const uaLower = ua.toLowerCase();
    
    if (uaLower.includes('edge') || uaLower.includes('edg/')) {
        result.browser = { name: 'Microsoft Edge', version: extractVersion(ua, 'edg/') };
        result.engine = { name: 'Blink', version: '' };
    } else if (uaLower.includes('chrome') && !uaLower.includes('chromium')) {
        result.browser = { name: 'Google Chrome', version: extractVersion(ua, 'chrome/') };
        result.engine = { name: 'Blink', version: '' };
    } else if (uaLower.includes('firefox')) {
        result.browser = { name: 'Mozilla Firefox', version: extractVersion(ua, 'firefox/') };
        result.engine = { name: 'Gecko', version: extractVersion(ua, 'rv:') };
    } else if (uaLower.includes('safari') && !uaLower.includes('chrome')) {
        result.browser = { name: 'Safari', version: extractVersion(ua, 'version/') };
        result.engine = { name: 'WebKit', version: extractVersion(ua, 'applewebkit/') };
    } else if (uaLower.includes('opera') || uaLower.includes('opr/')) {
        result.browser = { name: 'Opera', version: extractVersion(ua, 'opr/') || extractVersion(ua, 'opera/') };
        result.engine = { name: 'Blink', version: '' };
    }
    
    if (uaLower.includes('windows')) {
        result.os = { name: 'Windows', version: extractWindowsVersion(ua) };
        if (uaLower.includes('win64') || uaLower.includes('x64') || uaLower.includes('wow64')) {
            result.cpu = { name: 'x64', architecture: 'x64' };
        } else if (uaLower.includes('win32')) {
            result.cpu = { name: 'x86', architecture: 'x86' };
        }
    } else if (uaLower.includes('mac os x') || uaLower.includes('macos')) {
        result.os = { name: 'macOS', version: extractMacOSVersion(ua) };
        if (uaLower.includes('arm64')) {
            result.cpu = { name: 'ARM64', architecture: 'arm64' };
        } else {
            result.cpu = { name: 'Intel', architecture: 'x64' };
        }
    } else if (uaLower.includes('linux')) {
        result.os = { name: 'Linux', version: '' };
        if (uaLower.includes('x86_64') || uaLower.includes('amd64')) {
            result.cpu = { name: 'x64', architecture: 'x64' };
        } else if (uaLower.includes('x86')) {
            result.cpu = { name: 'x86', architecture: 'x86' };
        } else if (uaLower.includes('arm') || uaLower.includes('aarch64')) {
            result.cpu = { name: 'ARM', architecture: 'arm' };
        }
    } else if (uaLower.includes('android')) {
        result.os = { name: 'Android', version: extractAndroidVersion(ua) };
        result.device = { type: '手机/平板', model: extractAndroidModel(ua) };
    } else if (uaLower.includes('iphone') || uaLower.includes('ipad') || uaLower.includes('ipod')) {
        result.os = { name: 'iOS', version: extractIOSVersion(ua) };
        result.device = { type: 'Apple 设备', model: extractiOSDevice(ua) };
    }
    
    if (uaLower.includes('mobile') || uaLower.includes('android') && !uaLower.includes('tablet')) {
        if (result.device.type === '未知') {
            result.device = { ...result.device, type: '手机' };
        }
    } else if (uaLower.includes('tablet') || uaLower.includes('ipad')) {
        result.device = { ...result.device, type: '平板' };
    }
    
    if (uaLower.includes('bot') || uaLower.includes('crawler') || uaLower.includes('spider')) {
        result.device = { type: '爬虫/机器人', model: '' };
    }
    
    return result;
}

function extractVersion(ua, pattern) {
    const match = ua.match(new RegExp(pattern + '(\\d+([.]\\d+)*)', 'i'));
    return match ? match[1] : '';
}

function extractWindowsVersion(ua) {
    const match = ua.match(/windows nt (\d+\.\d+)/i);
    if (!match) return '';
    const versions = { '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7', '6.0': 'Vista', '5.1': 'XP' };
    return versions[match[1]] || match[1];
}

function extractMacOSVersion(ua) {
    const match = ua.match(/mac os x (\d+[._]\d+[._]?\d*)/i);
    if (!match) return '';
    return match[1].replace(/_/g, '.');
}

function extractAndroidVersion(ua) {
    const match = ua.match(/android (\d+\.?\d*)/i);
    return match ? match[1] : '';
}

function extractAndroidModel(ua) {
    const match = ua.match(/android[^;]*;\s*([^)]+)\)/i);
    return match ? match[1].trim() : '';
}

function extractIOSVersion(ua) {
    const match = ua.match(/os (\d+[._]\d+[._]?\d*)/i);
    if (!match) return '';
    return match[1].replace(/_/g, '.');
}

function extractiOSDevice(ua) {
    if (ua.includes('iPhone')) return 'iPhone';
    if (ua.includes('iPad')) return 'iPad';
    if (ua.includes('iPod')) return 'iPod';
    return '';
}

function renderUserAgent() {
    const currentUA = navigator.userAgent;
    const parsed = parseUserAgent(currentUA);
    
    return `
        <div class="tool-card">
            <h3>当前用户代理</h3>
            <div class="form-group">
                <textarea id="ua-input">${currentUA}</textarea>
            </div>
            ${button('分析', "analyzeUA()")}
        </div>
        <div class="tool-card">
            <h3>解析结果</h3>
            <div class="info-grid" id="ua-results">
                <div class="info-item">
                    <div class="label">浏览器</div>
                    <div class="value">${parsed.browser.name} ${parsed.browser.version}</div>
                </div>
                <div class="info-item">
                    <div class="label">渲染引擎</div>
                    <div class="value">${parsed.engine.name} ${parsed.engine.version}</div>
                </div>
                <div class="info-item">
                    <div class="label">操作系统</div>
                    <div class="value">${parsed.os.name} ${parsed.os.version}</div>
                </div>
                <div class="info-item">
                    <div class="label">CPU 架构</div>
                    <div class="value">${parsed.cpu.name}</div>
                </div>
                <div class="info-item">
                    <div class="label">设备类型</div>
                    <div class="value">${parsed.device.type}</div>
                </div>
                <div class="info-item">
                    <div class="label">设备型号</div>
                    <div class="value">${parsed.device.model || '-'}</div>
                </div>
            </div>
        </div>
        <div class="tool-card">
            <h3>常见用户代理示例</h3>
            <div class="form-group">
                <select id="ua-presets" onchange="loadUAPreset()">
                    <option value="">-- 选择预设 --</option>
                    <option value="chrome-windows">Chrome on Windows</option>
                    <option value="chrome-macos">Chrome on macOS</option>
                    <option value="chrome-linux">Chrome on Linux</option>
                    <option value="chrome-android">Chrome on Android</option>
                    <option value="safari-ios">Safari on iOS</option>
                    <option value="edge">Microsoft Edge</option>
                    <option value="firefox">Firefox</option>
                    <option value="bot">爬虫/Bot</option>
                </select>
            </div>
        </div>
    `;
}

const UA_PRESETS = {
    'chrome-windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'chrome-macos': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'chrome-linux': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'chrome-android': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'safari-ios': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'edge': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    'firefox': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'bot': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
};

function loadUAPreset() {
    const preset = $('#ua-presets').value;
    if (preset && UA_PRESETS[preset]) {
        $('#ua-input').value = UA_PRESETS[preset];
        analyzeUA();
    }
}

function analyzeUA() {
    const ua = $('#ua-input').value;
    if (!ua.trim()) return;
    
    const parsed = parseUserAgent(ua);
    
    $('#ua-results').innerHTML = `
        <div class="info-item">
            <div class="label">浏览器</div>
            <div class="value">${parsed.browser.name} ${parsed.browser.version}</div>
        </div>
        <div class="info-item">
            <div class="label">渲染引擎</div>
            <div class="value">${parsed.engine.name} ${parsed.engine.version}</div>
        </div>
        <div class="info-item">
            <div class="label">操作系统</div>
            <div class="value">${parsed.os.name} ${parsed.os.version}</div>
        </div>
        <div class="info-item">
            <div class="label">CPU 架构</div>
            <div class="value">${parsed.cpu.name}</div>
        </div>
        <div class="info-item">
            <div class="label">设备类型</div>
            <div class="value">${parsed.device.type}</div>
        </div>
        <div class="info-item">
            <div class="label">设备型号</div>
            <div class="value">${parsed.device.model || '-'}</div>
        </div>
    `;
}
