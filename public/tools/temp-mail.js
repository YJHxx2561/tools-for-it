function renderTempMail() {
    return `
        <div class="tool-card">
            <h3>临时邮箱</h3>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
                生成临时邮箱，有效期10分钟
            </p>
            <div class="form-group">
                <label>邮箱前缀</label>
                <input type="text" id="tempmail-name" placeholder="留空则随机生成（3-20位）">
            </div>
            <div class="form-group">
                <label>邮箱密码</label>
                <input type="text" id="tempmail-pwd" placeholder="留空则随机生成（8-20位）">
            </div>
            <div class="form-group">
                <label>域名后缀</label>
                <select id="tempmail-domain">
                    <option value="">随机选择</option>
                    <option value="apimail.email">apimail.email</option>
                    <option value="apimail.vip">apimail.vip</option>
                </select>
            </div>
        </div>
        <div class="tool-card">
            <h3>生成结果</h3>
            <div id="tempmail-result" class="result-list">
                <div class="result-placeholder">点击生成按钮创建临时邮箱</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('生成临时邮箱', "createTempMail()")}
        </div>
    `;
}

async function createTempMail() {
    const name = $('#tempmail-name').value.trim();
    const pwd = $('#tempmail-pwd').value.trim();
    const domain = $('#tempmail-domain').value;
    
    $('#tempmail-result').innerHTML = '<div class="result-placeholder">正在生成...</div>';
    
    try {
        let url = 'https://cn.apihz.cn/api/mail/mailcache.php?id=88888888&key=88888888&buytype=0';
        if (name) url += `&name=${name}`;
        if (pwd) url += `&pwd=${pwd}`;
        if (domain) url += `&domain=${domain}`;
        
        const data = await fetchWithBackupKey(url);
        
        if (data.code === 200) {
            const infoMap = [
                { label: '临时邮箱', value: data.mail, id: 'tempmail-mail' },
                { label: '密码', value: data.pwd, id: 'tempmail-pwd-result' },
                { label: '到期时间', value: data.endtime, id: 'tempmail-endtime' }
            ];
            
            let html = '';
            for (const info of infoMap) {
                html += `<div class="result-item">
                    <span class="result-label">${info.label}</span>
                    <span class="result-text" id="${info.id}">${info.value}</span>
                    <button class="copy-btn" onclick="copyResultById('${info.id}', this)">复制</button>
                </div>`;
            }
            
            $('#tempmail-result').innerHTML = html;
        } else {
            $('#tempmail-result').innerHTML = `<div class="result-placeholder" style="color: var(--danger);">生成失败：${data.msg || '未知错误'}</div>`;
        }
    } catch (error) {
        $('#tempmail-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">生成失败，请检查网络连接</div>';
    }
}
