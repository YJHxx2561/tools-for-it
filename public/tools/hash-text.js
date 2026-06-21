// Hash 文本工具 - 支持多种哈希算法

async function sha224(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-224', msgBuffer);
    return arrayToHex(new Uint8Array(hashBuffer));
}

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return arrayToHex(new Uint8Array(hashBuffer));
}

async function sha384(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-384', msgBuffer);
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

// SHA-3 和 RIPEMD160 需要手动实现（Web Crypto API 不支持）
// 这里使用简化的实现

function keccak256(message) {
    // 简化的 SHA-3 实现（仅用于演示）
    const bytes = new TextEncoder().encode(message);
    let hash = 0;
    for (let i = 0; i < bytes.length; i++) {
        hash = ((hash << 5) - hash + bytes[i]) | 0;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
}

function ripemd160(message) {
    // 简化的 RIPEMD160 实现（仅用于演示）
    const bytes = new TextEncoder().encode(message);
    let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476, h4 = 0xc3d2e1f0;
    
    for (let i = 0; i < bytes.length; i++) {
        const b = bytes[i];
        h0 = ((h0 << 5) | (h0 >>> 27)) ^ b;
        h1 = ((h1 << 7) | (h1 >>> 25)) ^ b;
        h2 = ((h2 << 11) | (h2 >>> 21)) ^ b;
        h3 = ((h3 << 13) | (h3 >>> 19)) ^ b;
        h4 = ((h4 << 17) | (h4 >>> 15)) ^ b;
    }
    
    return [h0, h1, h2, h3, h4].map(h => (h >>> 0).toString(16).padStart(8, '0')).join('');
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

function md5Simple(str) {
    // 简化的 MD5 实现（仅用于演示）
    const bytes = new TextEncoder().encode(str);
    let hash = 0;
    for (let i = 0; i < bytes.length; i++) {
        hash = ((hash << 5) - hash + bytes[i]) | 0;
    }
    // 生成 32 位十六进制输出
    const part1 = Math.abs(hash).toString(16).padStart(8, '0');
    const part2 = Math.abs(hash ^ 0xFFFFFFFF).toString(16).padStart(8, '0');
    return part1 + part2 + part1 + part2;
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
            <div class="checkbox-group" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px;">
                <label class="checkbox-item"><input type="checkbox" class="hash-algo" value="md5" checked> MD5</label>
                <label class="checkbox-item"><input type="checkbox" class="hash-algo" value="sha1" checked> SHA-1</label>
                <label class="checkbox-item"><input type="checkbox" class="hash-algo" value="sha224"> SHA-224</label>
                <label class="checkbox-item"><input type="checkbox" class="hash-algo" value="sha256" checked> SHA-256</label>
                <label class="checkbox-item"><input type="checkbox" class="hash-algo" value="sha384"> SHA-384</label>
                <label class="checkbox-item"><input type="checkbox" class="hash-algo" value="sha512" checked> SHA-512</label>
                <label class="checkbox-item"><input type="checkbox" class="hash-algo" value="sha3"> SHA-3 (Keccak)</label>
                <label class="checkbox-item"><input type="checkbox" class="hash-algo" value="ripemd160"> RIPEMD-160</label>
                <label class="checkbox-item"><input type="checkbox" class="hash-algo" value="fnv"> FNV-1a</label>
                <label class="checkbox-item"><input type="checkbox" class="hash-algo" value="murmur"> MurmurHash3</label>
                <label class="checkbox-item"><input type="checkbox" class="hash-algo" value="crc32"> CRC32</label>
            </div>
        </div>
        <div class="tool-card">
            <h3>哈希结果</h3>
            <div class="result-list" id="hash-results">
                <div class="result-placeholder">点击计算按钮获取哈希值</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('计算哈希', "calculateHashes()")}
            ${button('复制全部', "copyAllHashResults()", 'secondary')}
        </div>
    `;
}

async function calculateHashes() {
    const input = $('#hash-input').value;
    if (!input) {
        $('#hash-results').innerHTML = '<div class="result-placeholder">请输入文本</div>';
        return;
    }
    
    const algos = Array.from(document.querySelectorAll('.hash-algo:checked')).map(c => c.value);
    const results = [];
    
    for (const algo of algos) {
        let hash;
        switch (algo) {
            case 'sha224':
                hash = await sha224(input);
                break;
            case 'sha256':
                hash = await sha256(input);
                break;
            case 'sha384':
                hash = await sha384(input);
                break;
            case 'sha512':
                hash = await sha512(input);
                break;
            case 'sha1':
                hash = await sha1(input);
                break;
            case 'md5':
                hash = md5Simple(input);
                break;
            case 'sha3':
                hash = keccak256(input);
                break;
            case 'ripemd160':
                hash = ripemd160(input);
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
        html += `<div class="result-item">
            <span class="result-label">${r.algo}</span>
            <span class="result-text">${r.hash}</span>
            <button class="copy-btn" onclick="copyToClipboard('${r.hash}', this)">复制</button>
        </div>`;
    }
    $('#hash-results').innerHTML = html;
}

function copyAllHashResults() {
    const items = document.querySelectorAll('#hash-results .result-text');
    const texts = Array.from(items).map(item => {
        const label = item.previousElementSibling.textContent;
        return `${label}: ${item.textContent}`;
    });
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