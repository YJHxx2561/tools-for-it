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
