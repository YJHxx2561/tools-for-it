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
            <h3>强度评分</h3>
            <div class="strength-meter">
                <div class="strength-bar" id="strength-bar"></div>
            </div>
            <p id="strength-text" style="margin-top: 12px; font-size: 14px;"></p>
        </div>
        <div class="tool-card">
            <h3>破解时间估计</h3>
            <div id="crack-time-result" style="background: var(--bg-primary); padding: 16px; border-radius: 6px;"></div>
            <p style="color: var(--text-secondary); font-size: 12px; margin-top: 8px;">
                * 埇于假设攻击者使用不同硬件配置进行暴力破解的时间估计
            </p>
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
        hasSequence: /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password),
        hasCommon: /(password|123456|qwerty|admin|letmein|welcome|monkey|dragon)/i.test(password)
    };
    
    // 计算熵（entropy）
    let charsetSize = 0;
    if (details.hasLower) charsetSize += 26;
    if (details.hasUpper) charsetSize += 26;
    if (details.hasNumber) charsetSize += 10;
    if (details.hasSymbol) charsetSize += 32;
    
    if (charsetSize === 0) charsetSize = 1;
    const entropy = Math.log2(charsetSize) * details.length;
    
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
    if (!details.hasCommon) score += 1;
    
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
    
    return { score, level, text, className, details, entropy, charsetSize };
}

function estimateCrackTime(entropy) {
    // 不同攻击场景的猜测速率
    const scenarios = {
        '在线攻击 (1000/秒)': 1000,
        '普通电脑 (1000万/秒)': 10000000,
        'GPU 加速 (10亿/秒)': 1000000000,
        '大型僵尸网络 (1000亿/秒)': 100000000000,
        '专业破解设备 (1万亿/秒)': 1000000000000
    };
    
    const results = {};
    
    for (const [name, rate] of Object.entries(scenarios)) {
        const combinations = Math.pow(2, entropy);
        const seconds = combinations / rate / 2; // 平均需要尝试一半的组合
        
        results[name] = formatTime(seconds);
    }
    
    return results;
}

function formatTime(seconds) {
    if (seconds < 1) return '瞬间';
    if (seconds < 60) return `${Math.round(seconds)} 秒`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} 分钟`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} 小时`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} 天`;
    if (seconds < 31536000 * 100) return `${Math.round(seconds / 31536000)} 年`;
    if (seconds < 31536000 * 1000000) return `${Math.round(seconds / 31536000 / 1000)} 千年`;
    if (seconds < 31536000 * 1000000000) return `${Math.round(seconds / 31536000 / 1000000)} 百万年`;
    return '宇宙年龄级别';
}

function initPasswordStrength() {
    document.addEventListener('input', (e) => {
        if (e.target.id === 'strength-input') {
            const password = e.target.value;
            if (!password) {
                $('#strength-bar')?.classList.remove('strength-weak', 'strength-fair', 'strength-good', 'strength-strong');
                $('#strength-bar')?.style.setProperty('width', '0');
                $('#strength-text').textContent = '';
                $('#strength-details').innerHTML = '';
                $('#crack-time-result').innerHTML = '';
                return;
            }
            
            const result = analyzePasswordStrength(password);
            $('#strength-bar').className = 'strength-bar ' + result.className;
            $('#strength-text').textContent = `评分: ${result.score}/11 - ${result.text}`;
            
            // 破解时间估计
            const crackTimes = estimateCrackTime(result.entropy);
            let crackHtml = '<div class="info-grid">';
            for (const [name, time] of Object.entries(crackTimes)) {
                const color = time.includes('瞬间') || time.includes('秒') || time.includes('分钟') ? 'var(--danger)' :
                              time.includes('小时') || time.includes('天') ? 'var(--warning)' : 'var(--success)';
                crackHtml += `<div class="info-item">
                    <div class="label">${name}</div>
                    <div class="value" style="color: ${color};">${time}</div>
                </div>`;
            }
            crackHtml += `<div class="info-item">
                <div class="label">熵值</div>
                <div class="value">${result.entropy.toFixed(2)} bits</div>
            </div>`;
            crackHtml += '</div>';
            $('#crack-time-result').innerHTML = crackHtml;
            
            // 详细信息
            const d = result.details;
            $('#strength-details').innerHTML = `
                <div class="info-grid">
                    <div class="info-item">
                        <div class="label">长度</div>
                        <div class="value">${d.length} 字符</div>
                    </div>
                    <div class="info-item">
                        <div class="label">字符集大小</div>
                        <div class="value">${result.charsetSize}</div>
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
                    <div class="info-item">
                        <div class="label">常见密码</div>
                        <div class="value" style="color: ${d.hasCommon ? 'var(--danger)' : 'var(--success)'}">${d.hasCommon ? '⚠ 包含' : '✓ 不包含'}</div>
                    </div>
                </div>
            `;
        }
        
        if (e.target.id === 'show-password') {
            const pwd = $('#strength-input');
            pwd.type = e.target.checked ? 'text' : 'password';
        }
    });
}