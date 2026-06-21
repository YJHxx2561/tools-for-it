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
                <label>生成数量</label>
                <input type="number" id="port-count" value="10" min="1" max="100">
            </div>
            <div class="form-group">
                <label>排除端口</label>
                <input type="text" id="port-exclude" placeholder="如: 80, 443, 22">
            </div>
        </div>
        <div class="tool-card">
            <h3>生成结果</h3>
            <div class="result-list" id="port-result">
                <div class="result-placeholder">点击生成按钮获取端口</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('生成', "generatePorts()")}
            ${button('复制全部', "copyAllResults('port-result')", 'secondary')}
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
    for (let i = 0; i < count * 3 && ports.length < Math.min(count, 100); i++) {
        const port = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!exclude.includes(port) && !ports.includes(port)) {
            ports.push(port);
        }
    }
    
    let html = '';
    for (const port of ports) {
        html += `<div class="result-item">
            <span class="result-text">${port}</span>
            <button class="copy-btn" onclick="copyToClipboard('${port}', this)">复制</button>
        </div>`;
    }
    
    $('#port-result').innerHTML = html || '<div class="result-placeholder">无法生成符合条件的端口</div>';
}