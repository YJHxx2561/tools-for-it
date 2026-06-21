// RSA 密钥对生成器

function renderRSAKeyGenerator() {
    return `
        <div class="tool-card">
            <h3>配置</h3>
            <div class="form-group">
                <label>密钥大小 (Bits)</label>
                <select id="rsa-bits">
                    <option value="2048">2048 (推荐)</option>
                    <option value="3072">3072 (高安全)</option>
                    <option value="4096">4096 (最高安全)</option>
                </select>
            </div>
            <div class="form-group">
                <label>生成数量</label>
                <input type="number" id="rsa-count" value="1" min="1" max="10">
            </div>
        </div>
        <div class="tool-card">
            <h3>生成结果</h3>
            <div class="result-list" id="rsa-result" style="max-height: 600px;">
                <div class="result-placeholder">点击生成按钮获取密钥对</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('生成密钥对', "generateRSAKeys()")}
        </div>
    `;
}

async function generateRSAKeys() {
    const bits = parseInt($('#rsa-bits').value);
    const count = parseInt($('#rsa-count').value) || 1;
    
    $('#rsa-result').innerHTML = '<div class="result-placeholder">正在生成密钥对...</div>';
    
    const results = [];
    
    for (let i = 0; i < Math.min(count, 10); i++) {
        try {
            const keyPair = await crypto.subtle.generateKey(
                {
                    name: 'RSASSA-PKCS1-v1_5',
                    modulusLength: bits,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: 'SHA-256'
                },
                true,
                ['sign', 'verify']
            );
            
            // 导出私钥
            const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
            const privateKeyPem = formatPEM(privateKeyBuffer, 'PRIVATE KEY');
            
            // 导出公钥
            const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey);
            const publicKeyPem = formatPEM(publicKeyBuffer, 'PUBLIC KEY');
            
            results.push({
                bits: bits,
                privateKey: privateKeyPem,
                publicKey: publicKeyPem
            });
        } catch (e) {
            $('#rsa-result').innerHTML = `<div class="result-placeholder" style="color: var(--danger);">生成错误：${e.message}</div>`;
            return;
        }
    }
    
    let html = '';
    for (let i = 0; i < results.length; i++) {
        const r = results[i];
        html += `
            <div class="rsa-key-pair" style="margin-bottom: 16px;">
                <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 8px;">
                    密钥对 #${i + 1} (${r.bits} bits)
                </div>
                <div class="result-item" style="flex-direction: column; align-items: stretch;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="font-weight: 600; color: var(--accent);">私钥 (PEM)</span>
                        <button class="copy-btn" onclick="copyToClipboard(this.parentElement.nextElementSibling.textContent, this)">复制</button>
                    </div>
                    <pre style="background: var(--bg-primary); padding: 12px; border-radius: 4px; font-size: 12px; white-space: pre-wrap; word-break: break-all; margin: 0;">${r.privateKey}</pre>
                </div>
                <div class="result-item" style="flex-direction: column; align-items: stretch; margin-top: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="font-weight: 600; color: var(--accent);">公钥 (PEM)</span>
                        <button class="copy-btn" onclick="copyToClipboard(this.parentElement.nextElementSibling.textContent, this)">复制</button>
                    </div>
                    <pre style="background: var(--bg-primary); padding: 12px; border-radius: 4px; font-size: 12px; white-space: pre-wrap; word-break: break-all; margin: 0;">${r.publicKey}</pre>
                </div>
            </div>
        `;
        if (i < results.length - 1) {
            html += '<hr style="border-color: var(--border-color); margin: 16px 0;">';
        }
    }
    
    $('#rsa-result').innerHTML = html;
}

function formatPEM(buffer, label) {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const lines = base64.match(/.{1,64}/g) || [];
    return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
}