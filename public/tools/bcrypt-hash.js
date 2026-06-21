// Bcrypt 哈希工具 - 使用 Web Crypto API 模拟 bcrypt 功能
// 注意：浏览器端无法完全实现 bcrypt，这里使用 PBKDF2 作为替代方案

function renderBcryptHash() {
    return `
        <div class="tool-card">
            <h3>Bcrypt 哈希</h3>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
                使用 PBKDF2 算法模拟 bcrypt 功能（浏览器端安全哈希）
            </p>
            <div class="form-group">
                <label>输入文本</label>
                <input type="text" id="bcrypt-input" placeholder="输入要哈希的文本...">
            </div>
            <div class="form-group">
                <label>迭代次数（成本因子）</label>
                <select id="bcrypt-rounds">
                    <option value="10">10 (默认)</option>
                    <option value="12">12 (中等)</option>
                    <option value="14">14 (高安全)</option>
                    <option value="16">16 (最高安全)</option>
                </select>
            </div>
        </div>
        <div class="tool-card">
            <h3>哈希结果</h3>
            <div class="result-list" id="bcrypt-hash-result">
                <div class="result-placeholder">点击生成按钮获取哈希</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('生成哈希', "generateBcryptHash()")}
            ${button('复制全部', "copyAllResults('bcrypt-hash-result')", 'secondary')}
        </div>
        
        <div class="tool-card" style="margin-top: 20px;">
            <h3>Bcrypt 验证</h3>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
                验证文本是否与哈希匹配
            </p>
            <div class="form-group">
                <label>原始文本</label>
                <input type="text" id="bcrypt-verify-input" placeholder="输入原始文本...">
            </div>
            <div class="form-group">
                <label>哈希值</label>
                <textarea id="bcrypt-verify-hash" placeholder="输入哈希值..." style="min-height: 60px;"></textarea>
            </div>
            <div id="bcrypt-verify-result" style="padding: 12px; border-radius: 6px; background: var(--bg-primary); margin-top: 12px;"></div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('验证', "verifyBcryptHash()")}
        </div>
    `;
}

async function generateBcryptHash() {
    const input = $('#bcrypt-input').value;
    if (!input) {
        $('#bcrypt-hash-result').innerHTML = '<div class="result-placeholder">请输入文本</div>';
        return;
    }
    
    const rounds = parseInt($('#bcrypt-rounds').value);
    const iterations = Math.pow(2, rounds);
    
    // 生成随机盐
    const salt = generateRandomBytes(16);
    const saltHex = arrayToHex(salt);
    
    // 使用 PBKDF2 进行哈希
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(input),
        'PBKDF2',
        false,
        ['deriveBits']
    );
    
    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: iterations,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );
    
    const hashHex = arrayToHex(new Uint8Array(derivedBits));
    
    // 格式化输出（模拟 bcrypt 格式）
    const bcryptFormat = `$pbkdf2-sha256$${rounds}$${saltHex}$${hashHex}`;
    
    $('#bcrypt-hash-result').innerHTML = `
        <div class="result-item">
            <span class="result-label">格式化哈希：</span>
            <span class="result-text">${bcryptFormat}</span>
            <button class="copy-btn" onclick="copyToClipboard('${bcryptFormat}', this)">复制</button>
        </div>
        <div class="result-item">
            <span class="result-label">纯哈希：</span>
            <span class="result-text">${hashHex}</span>
            <button class="copy-btn" onclick="copyToClipboard('${hashHex}', this)">复制</button>
        </div>
        <div class="result-item">
            <span class="result-label">盐值：</span>
            <span class="result-text">${saltHex}</span>
            <button class="copy-btn" onclick="copyToClipboard('${saltHex}', this)">复制</button>
        </div>
        <div class="result-item">
            <span class="result-label">迭代次数：</span>
            <span class="result-text">${iterations}</span>
            <button class="copy-btn" onclick="copyToClipboard('${iterations}', this)">复制</button>
        </div>
    `;
}

async function verifyBcryptHash() {
    const input = $('#bcrypt-verify-input').value;
    const hashStr = $('#bcrypt-verify-hash').value;
    
    if (!input || !hashStr) {
        $('#bcrypt-verify-result').innerHTML = '<span style="color: var(--warning);">请输入文本和哈希值</span>';
        return;
    }
    
    try {
        // 解析哈希格式
        const parts = hashStr.split('$');
        let rounds, saltHex, expectedHash;
        
        if (parts.length >= 5 && hashStr.startsWith('$pbkdf2-sha256$')) {
            rounds = parseInt(parts[2]);
            saltHex = parts[3];
            expectedHash = parts[4];
        } else {
            $('#bcrypt-verify-result').innerHTML = '<span style="color: var(--danger);">无效的哈希格式</span>';
            return;
        }
        
        const iterations = Math.pow(2, rounds);
        const salt = new Uint8Array(saltHex.match(/.{2}/g).map(b => parseInt(b, 16)));
        
        // 重新计算哈希
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(input),
            'PBKDF2',
            false,
            ['deriveBits']
        );
        
        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: iterations,
                hash: 'SHA-256'
            },
            keyMaterial,
            256
        );
        
        const computedHash = arrayToHex(new Uint8Array(derivedBits));
        
        if (computedHash === expectedHash) {
            $('#bcrypt-verify-result').innerHTML = '<span style="color: var(--success);">✓ 验证成功！文本与哈希匹配</span>';
        } else {
            $('#bcrypt-verify-result').innerHTML = '<span style="color: var(--danger);">✗ 验证失败！文本与哈希不匹配</span>';
        }
    } catch (e) {
        $('#bcrypt-verify-result').innerHTML = `<span style="color: var(--danger);">验证错误：${e.message}</span>`;
    }
}