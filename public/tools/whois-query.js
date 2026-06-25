function renderWhoisQuery() {
    return `
        <div class="tool-card">
            <h3>顶级域名 WHOIS 查询</h3>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
                查询域名的 WHOIS 注册信息
            </p>
            <div class="form-group">
                <label>域名</label>
                <input type="text" id="whois-domain-input" placeholder="例如: erguanmingmin.com">
            </div>
        </div>
        <div class="tool-card">
            <h3>查询结果</h3>
            <div id="whois-result" class="result-list">
                <div class="result-placeholder">输入域名后点击查询按钮</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('查询', "queryWhois()")}
        </div>
    `;
}

async function queryWhois() {
    const domain = $('#whois-domain-input').value.trim();
    
    if (!domain) {
        $('#whois-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">请输入域名</div>';
        return;
    }
    
    $('#whois-result').innerHTML = '<div class="result-placeholder">正在查询...</div>';
    
    try {
        const data = await fetchWithBackupKey(`https://cn.apihz.cn/api/wangzhan/whois.php?id=88888888&key=88888888&domain=${domain}`);
        
        if (data.code === 200) {
            let html = '';
            
            const infoMap = [
                { label: '查询域名', value: data.domain || '未知' },
                { label: '域名标识符', value: data.handle || '未知' },
                { label: '域名状态', value: Array.isArray(data.status) ? data.status.join(', ') : data.status || '未知' },
                { label: '注册商', value: data.zcname || '未知' },
                { label: '注册时间', value: data.addtime || '未知' },
                { label: '到期时间', value: data.endtime || '未知' },
                { label: '更改时间', value: data.uptime || '未知' },
                { label: 'DNSSEC', value: data.dnssec ? '已启用' : '未启用' }
            ];
            
            for (const info of infoMap) {
                html += `<div class="result-item">
                    <span class="result-label">${info.label}</span>
                    <span class="result-text">${info.value}</span>
                </div>`;
            }
            
            // NS 服务器
            for (let i = 1; i <= 7; i++) {
                const ns = data[`ns${i}`];
                if (ns) {
                    html += `<div class="result-item">
                        <span class="result-label">NS 服务器 ${i}</span>
                        <span class="result-text">${ns}</span>
                    </div>`;
                }
            }
            
            $('#whois-result').innerHTML = html;
        } else {
            $('#whois-result').innerHTML = `<div class="result-placeholder" style="color: var(--danger);">查询失败：${data.msg || '未知错误'}</div>`;
        }
    } catch (error) {
        $('#whois-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">查询失败，请检查网络连接</div>';
    }
}
