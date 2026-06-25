function renderBankCardQuery() {
    return `
        <div class="tool-card">
            <h3>银行卡归属地查询</h3>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
                根据银行卡号查询开户行、卡类型等信息
            </p>
            <div class="form-group">
                <label>银行卡号</label>
                <input type="text" id="bankcard-input" placeholder="输入银行卡号" maxlength="23">
            </div>
        </div>
        <div class="tool-card">
            <h3>查询结果</h3>
            <div id="bankcard-result" class="result-list">
                <div class="result-placeholder">输入银行卡号后点击查询按钮</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('查询', "queryBankCard()")}
        </div>
    `;
}

async function queryBankCard() {
    const cardNo = $('#bankcard-input').value.trim().replace(/\s/g, '');
    
    if (!cardNo) {
        $('#bankcard-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">请输入银行卡号</div>';
        return;
    }
    
    if (!/^\d{16,19}$/.test(cardNo)) {
        $('#bankcard-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">银行卡号格式不正确</div>';
        return;
    }
    
    $('#bankcard-result').innerHTML = '<div class="result-placeholder">正在查询...</div>';
    
    try {
        const data = await fetchWithBackupKey(`https://cn.apihz.cn/api/other/bank.php?id=88888888&key=88888888&number=${cardNo}`);
        
        if (data.code === 200) {
            const cardTypeMap = {
                1: '借记卡',
                2: '贷记卡（信用卡）',
                3: '预付费卡',
                4: '准贷记卡'
            };
            
            const infoMap = [
                { label: '银行', value: data.bank || '未知' },
                { label: '卡类型', value: cardTypeMap[data.type] || '未知' },
                { label: '状态', value: data.msg || '查询成功' }
            ];
            
            let html = '';
            for (const info of infoMap) {
                html += `<div class="result-item">
                    <span class="result-label">${info.label}</span>
                    <span class="result-text">${info.value}</span>
                </div>`;
            }
            
            $('#bankcard-result').innerHTML = html;
        } else {
            const localResult = parseBankCardLocally(cardNo);
            let html = '';
            for (const info of localResult) {
                html += `<div class="result-item">
                    <span class="result-label">${info.label}</span>
                    <span class="result-text">${info.value}</span>
                </div>`;
            }
            html += `<div class="result-item" style="color: var(--warning);">
                <span class="result-label">提示</span>
                <span class="result-text">API查询失败：${data.msg || '未知错误'}，显示本地估算结果</span>
            </div>`;
            $('#bankcard-result').innerHTML = html;
        }
    } catch (error) {
        const localResult = parseBankCardLocally(cardNo);
        let html = '';
        for (const info of localResult) {
            html += `<div class="result-item">
                <span class="result-label">${info.label}</span>
                <span class="result-text">${info.value}</span>
            </div>`;
        }
        html += `<div class="result-item" style="color: var(--warning);">
            <span class="result-label">提示</span>
            <span class="result-text">网络请求失败，显示本地估算结果</span>
        </div>`;
        $('#bankcard-result').innerHTML = html;
    }
}

function parseBankCardLocally(cardNo) {
    const prefix6 = cardNo.substring(0, 6);
    const prefix4 = cardNo.substring(0, 4);
    
    if (/^6217/.test(cardNo)) {
        return [
            { label: '卡段', value: prefix6 },
            { label: '银行名称', value: '中国银行/其他银行' },
            { label: '卡类型', value: '借记卡' }
        ];
    }
    
    if (/^6222/.test(cardNo)) {
        return [
            { label: '卡段', value: prefix6 },
            { label: '银行名称', value: '中国工商银行/农业银行' },
            { label: '卡类型', value: '借记卡' }
        ];
    }
    
    if (/^62/.test(cardNo)) {
        return [
            { label: '卡段', value: prefix6 },
            { label: '银行名称', value: '银联卡（具体银行需联网查询）' },
            { label: '卡类型', value: '借记卡/信用卡' }
        ];
    }
    
    if (/^4/.test(cardNo)) {
        return [
            { label: '卡段', value: prefix4 },
            { label: '银行名称', value: 'VISA国际卡' },
            { label: '卡类型', value: '信用卡' }
        ];
    }
    
    if (/^5[1-5]/.test(cardNo)) {
        return [
            { label: '卡段', value: prefix4 },
            { label: '银行名称', value: 'MasterCard国际卡' },
            { label: '卡类型', value: '信用卡' }
        ];
    }
    
    return [
        { label: '卡段', value: prefix6 },
        { label: '银行名称', value: '未知银行' },
        { label: '卡类型', value: '借记卡/信用卡' }
    ];
}