function renderByteCalculator() {
    return `
        <div class="tool-card">
            <h3>字节计算器</h3>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
                计算 bit, byte, KB, MB, GB, TB, PB 之间的换算
            </p>
            <div class="form-group">
                <label>输入数值</label>
                <input type="text" id="byte-input" placeholder="例如: 1024, 1GB, 100 MB">
            </div>
            <div class="form-group">
                <label>自动识别单位</label>
                <select id="byte-unit-select" style="display: none;">
                    <option value="">自动检测</option>
                    <option value="bit">bit (位)</option>
                    <option value="byte">Byte (字节)</option>
                    <option value="kb">KB (千字节)</option>
                    <option value="mb">MB (兆字节)</option>
                    <option value="gb">GB (吉字节)</option>
                    <option value="tb">TB (太字节)</option>
                    <option value="pb">PB (拍字节)</option>
                </select>
            </div>
        </div>
        <div class="tool-card">
            <h3>换算结果</h3>
            <div id="byte-result" class="result-list">
                <div class="result-placeholder">输入数值后点击计算按钮</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('计算', "calculateBytes()")}
            ${button('复制全部', "copyAllResults('byte-result')", 'secondary')}
        </div>
    `;
}

const BYTE_UNITS = {
    'bit': { name: 'bit', symbol: 'b', factor: 0.125 },
    'byte': { name: 'Byte', symbol: 'B', factor: 1 },
    'kb': { name: 'KB', symbol: 'KB', factor: 1024 },
    'mb': { name: 'MB', symbol: 'MB', factor: 1024 * 1024 },
    'gb': { name: 'GB', symbol: 'GB', factor: 1024 * 1024 * 1024 },
    'tb': { name: 'TB', symbol: 'TB', factor: 1024 * 1024 * 1024 * 1024 },
    'pb': { name: 'PB', symbol: 'PB', factor: 1024 * 1024 * 1024 * 1024 * 1024 }
};

const UNIT_PATTERNS = {
    'pb': /(\d+\.?\d*)\s*(pb|拍)/i,
    'tb': /(\d+\.?\d*)\s*(tb|太|t)/i,
    'gb': /(\d+\.?\d*)\s*(gb|吉|g)/i,
    'mb': /(\d+\.?\d*)\s*(mb|兆|m)/i,
    'kb': /(\d+\.?\d*)\s*(kb|k)/i,
    'byte': /(\d+\.?\d*)\s*(b|byte|字节)/i,
    'bit': /(\d+\.?\d*)\s*(bit|位|b(?!yte))/i
};

function detectUnit(input) {
    for (const [unit, pattern] of Object.entries(UNIT_PATTERNS)) {
        const match = input.match(pattern);
        if (match) {
            return { unit, value: parseFloat(match[1]) };
        }
    }
    return { unit: 'byte', value: parseFloat(input) };
}

function formatNumber(num) {
    if (num >= 1e15) return num.toExponential(4);
    if (num < 0.0001) return num.toExponential(4);
    if (Number.isInteger(num)) return num.toLocaleString();
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function calculateBytes() {
    const input = $('#byte-input').value.trim();
    
    if (!input) {
        $('#byte-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">请输入数值</div>';
        return;
    }
    
    const { unit, value } = detectUnit(input);
    
    if (isNaN(value) || value < 0) {
        $('#byte-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">请输入有效的数值</div>';
        return;
    }
    
    const bytes = value * BYTE_UNITS[unit].factor;
    
    let html = '';
    for (const [key, data] of Object.entries(BYTE_UNITS)) {
        const result = bytes / data.factor;
        const label = key === 'bit' ? '位' : '字节';
        html += `<div class="result-item">
            <span class="result-label">${data.name}</span>
            <span class="result-text">${formatNumber(result)} ${data.symbol}</span>
            <button class="copy-btn" onclick="copyToClipboard('${formatNumber(result)} ${data.symbol}', this)">复制</button>
        </div>`;
    }
    
    $('#byte-result').innerHTML = html;
}
