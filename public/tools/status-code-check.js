function renderStatusCodeCheck() {
    return `
        <div class="tool-card">
            <h3>网站状态码检测</h3>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
                检测网址的 HTTP 状态码，支持国内、香港、美国节点
            </p>
            <div class="form-group">
                <label>检测网址</label>
                <input type="text" id="status-url" placeholder="例如: www.apihz.cn">
            </div>
            <div class="form-group">
                <label>访问节点</label>
                <select id="status-type">
                    <option value="1">国内节点</option>
                    <option value="2">香港节点</option>
                    <option value="3">美国节点</option>
                </select>
            </div>
        </div>
        <div class="tool-card">
            <h3>检测结果</h3>
            <div id="status-result" class="result-list">
                <div class="result-placeholder">输入网址后点击检测按钮</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('开始检测', "checkStatusCode()")}
        </div>
    `;
}

async function checkStatusCode() {
    const url = $('#status-url').value.trim();
    const type = $('#status-type').value;
    
    if (!url) {
        $('#status-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">请输入检测网址</div>';
        return;
    }
    
    $('#status-result').innerHTML = '<div class="result-placeholder">正在检测...</div>';
    
    try {
        const data = await fetchWithBackupKey(`https://cn.apihz.cn/api/wangzhan/getcode.php?id=88888888&key=88888888&type=${type}&url=${encodeURIComponent(url)}`);
        
        if (data.code === 200) {
            const statusCode = parseInt(data.msg);
            let statusColor = 'var(--text-secondary)';
            let statusLabel = '其他';
            
            if (statusCode >= 200 && statusCode < 300) {
                statusColor = 'var(--success)';
                statusLabel = '成功';
            } else if (statusCode >= 300 && statusCode < 400) {
                statusColor = 'var(--warning)';
                statusLabel = '重定向';
            } else if (statusCode >= 400 && statusCode < 500) {
                statusColor = 'var(--danger)';
                statusLabel = '客户端错误';
            } else if (statusCode >= 500) {
                statusColor = 'var(--danger)';
                statusLabel = '服务器错误';
            }
            
            const typeLabels = { '1': '国内', '2': '香港', '3': '美国' };
            
            $('#status-result').innerHTML = `<div class="result-item" style="background: rgba(63, 185, 80, 0.1); border-color: var(--success);">
                <span class="result-label">状态码</span>
                <span class="result-text" style="color: ${statusColor}; font-size: 24px; font-weight: bold;">${data.msg}</span>
            </div>
            <div class="result-item">
                <span class="result-label">状态类型</span>
                <span class="result-text">${statusLabel}</span>
            </div>
            <div class="result-item">
                <span class="result-label">检测网址</span>
                <span class="result-text">${url}</span>
            </div>
            <div class="result-item">
                <span class="result-label">访问节点</span>
                <span class="result-text">${typeLabels[type]}节点</span>
            </div>`;
        } else {
            $('#status-result').innerHTML = `<div class="result-placeholder" style="color: var(--danger);">检测失败：${data.msg || '未知错误'}</div>`;
        }
    } catch (error) {
        $('#status-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">检测失败，请检查网络连接</div>';
    }
}