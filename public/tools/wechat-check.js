function renderWechatCheck() {
    return `
        <div class="tool-card">
            <h3>微信域名拦截检测</h3>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
                检测网址是否被微信拦截（检测同一网址请间隔两分钟）
            </p>
            <div class="form-group">
                <label>检测网址</label>
                <input type="text" id="wechat-url" placeholder="例如: www.apihz.cn">
            </div>
        </div>
        <div class="tool-card">
            <h3>检测结果</h3>
            <div id="wechat-result" class="result-list">
                <div class="result-placeholder">输入网址后点击检测按钮</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('开始检测', "checkWechat()")}
        </div>
    `;
}

async function checkWechat() {
    const url = $('#wechat-url').value.trim();
    
    if (!url) {
        $('#wechat-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">请输入检测网址</div>';
        return;
    }
    
    $('#wechat-result').innerHTML = '<div class="result-placeholder">正在检测...</div>';
    
    try {
        const data = await fetchWithBackupKey(`https://cn.apihz.cn/api/wangzhan/wxfh.php?id=88888888&key=88888888&url=${encodeURIComponent(url)}`);
        
        let html = '';
        
        if (data.code === 200) {
            html = `<div class="result-item" style="background: rgba(63, 185, 80, 0.1); border-color: var(--success);">
                <span class="result-label">状态</span>
                <span class="result-text" style="color: var(--success);">✓ 正常访问</span>
            </div>
            <div class="result-item">
                <span class="result-label">检测网址</span>
                <span class="result-text">${data.url}</span>
            </div>
            <div class="result-item">
                <span class="result-label">提示</span>
                <span class="result-text">${data.msg}</span>
            </div>`;
        } else if (data.code === 444) {
            html = `<div class="result-item" style="background: rgba(248, 81, 73, 0.1); border-color: var(--danger);">
                <span class="result-label">状态</span>
                <span class="result-text" style="color: var(--danger);">✗ 已被拦截</span>
            </div>
            <div class="result-item">
                <span class="result-label">检测网址</span>
                <span class="result-text">${data.url}</span>
            </div>
            <div class="result-item">
                <span class="result-label">提示</span>
                <span class="result-text">${data.msg}</span>
            </div>`;
        } else {
            html = `<div class="result-placeholder" style="color: var(--danger);">检测失败：${data.msg || '未知错误'}</div>`;
        }
        
        $('#wechat-result').innerHTML = html;
    } catch (error) {
        $('#wechat-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">检测失败，请检查网络连接</div>';
    }
}