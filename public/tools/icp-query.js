function renderIcpQuery() {
    return `
        <div class="tool-card">
            <h3>ICP 备案查询</h3>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
                查询域名的 ICP 备案信息
            </p>
            <div class="form-group">
                <label>域名</label>
                <input type="text" id="icp-domain-input" placeholder="例如: apihz.cn">
            </div>
        </div>
        <div class="tool-card">
            <h3>查询结果</h3>
            <div id="icp-result" class="result-list">
                <div class="result-placeholder">输入域名后点击查询按钮</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('查询', "queryIcp()")}
        </div>
    `;
}

async function queryIcp() {
    const domain = $('#icp-domain-input').value.trim();
    
    if (!domain) {
        $('#icp-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">请输入域名</div>';
        return;
    }
    
    $('#icp-result').innerHTML = '<div class="result-placeholder">正在查询...</div>';
    
    try {
        const data = await fetchWithBackupKey(`https://cn.apihz.cn/api/wangzhan/icp.php?id=88888888&key=88888888&domain=${domain}`);
        
        if (data.code === 200) {
            const infoMap = [
                { label: '备案号', value: data.icp || '未知' },
                { label: '主体性质', value: data.type || '未知' },
                { label: '备案主体', value: data.unit || '未知' },
                { label: '域名', value: data.domain || '未知' },
                { label: '审核时间', value: data.time || '未知' }
            ];
            
            let html = '';
            for (const info of infoMap) {
                html += `<div class="result-item">
                    <span class="result-label">${info.label}</span>
                    <span class="result-text">${info.value}</span>
                </div>`;
            }
            
            $('#icp-result').innerHTML = html;
        } else {
            $('#icp-result').innerHTML = `<div class="result-placeholder" style="color: var(--danger);">查询失败：${data.msg || '未知错误'}</div>`;
        }
    } catch (error) {
        $('#icp-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">查询失败，请检查网络连接</div>';
    }
}
