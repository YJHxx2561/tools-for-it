function renderTranslator() {
    return `
        <div class="tool-card">
            <h3>文本翻译</h3>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
                支持中文、英文、繁体中文、日语、韩语等多种语言互译
            </p>
            <div class="form-group">
                <label>输入文本</label>
                <textarea id="translate-input" placeholder="输入要翻译的文本..." rows="4"></textarea>
            </div>
            <div class="form-group">
                <label>目标语言</label>
                <select id="translate-type">
                    <option value="1">中文</option>
                    <option value="2">英文</option>
                    <option value="3">繁体中文</option>
                    <option value="4">日语</option>
                    <option value="5">韩语</option>
                    <option value="6">法语</option>
                    <option value="7">西班牙语</option>
                    <option value="8">泰语</option>
                    <option value="9">阿拉伯语</option>
                    <option value="10">俄语</option>
                    <option value="11">葡萄牙语</option>
                    <option value="12">德语</option>
                    <option value="13">意大利语</option>
                </select>
            </div>
        </div>
        <div class="tool-card">
            <h3>翻译结果</h3>
            <div id="translate-result" class="result-list">
                <div class="result-placeholder">输入文本后点击翻译按钮</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('翻译', "translateText()")}
            ${button('复制结果', "copyTranslateResult()", 'secondary')}
        </div>
    `;
}

async function translateText() {
    const words = $('#translate-input').value.trim();
    const type = $('#translate-type').value;
    
    if (!words) {
        $('#translate-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">请输入要翻译的文本</div>';
        return;
    }
    
    $('#translate-result').innerHTML = '<div class="result-placeholder">正在翻译...</div>';
    
    try {
        const data = await fetchWithBackupKey(`https://cn.apihz.cn/api/zici/fanyi.php?id=88888888&key=88888888&words=${encodeURIComponent(words)}&type=${type}`);
        
        if (data.code === 200) {
            $('#translate-result').innerHTML = `<div class="result-item" style="flex-direction: column; align-items: flex-start;">
                <span class="result-label" style="margin-bottom: 8px;">翻译结果</span>
                <span class="result-text" id="translate-output" style="text-align: left; width: 100%; line-height: 1.6;">${data.words}</span>
            </div>`;
        } else {
            $('#translate-result').innerHTML = `<div class="result-placeholder" style="color: var(--danger);">翻译失败：${data.msg || '未知错误'}</div>`;
        }
    } catch (error) {
        $('#translate-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">翻译失败，请检查网络连接</div>';
    }
}

function copyTranslateResult() {
    const output = $('#translate-output');
    if (output) {
        navigator.clipboard.writeText(output.textContent).then(() => {
            alert('已复制到剪贴板');
        });
    } else {
        alert('请先翻译文本');
    }
}