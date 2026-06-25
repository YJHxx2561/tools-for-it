function renderPhoneQuery() {
    return `
        <div class="tool-card">
            <h3>手机归属地查询</h3>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
                根据手机号码查询归属地、运营商、区号、邮编等信息
            </p>
            <div class="form-group">
                <label>手机号码</label>
                <input type="text" id="phone-input" placeholder="输入手机号码（支持11位或7位）" maxlength="11">
            </div>
        </div>
        <div class="tool-card">
            <h3>查询结果</h3>
            <div id="phone-result" class="result-list">
                <div class="result-placeholder">输入手机号码后点击查询按钮</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('查询', "queryPhone()")}
        </div>
    `;
}

async function queryPhone() {
    const phone = $('#phone-input').value.trim();
    
    if (!phone) {
        $('#phone-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">请输入手机号码</div>';
        return;
    }
    
    if (!/^\d{7,11}$/.test(phone)) {
        $('#phone-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">手机号码格式不正确</div>';
        return;
    }
    
    $('#phone-result').innerHTML = '<div class="result-placeholder">正在查询...</div>';
    
    try {
        const data = await fetchWithBackupKey(`https://cn.apihz.cn/api/ip/shouji.php?id=88888888&key=88888888&phone=${phone}`);
        
        if (data.code === 200) {
            const infoMap = [
                { label: '号段', value: data.haoduan || phone.substring(0, 7) },
                { label: '省份', value: data.shengfen || '未知' },
                { label: '城市', value: data.chengshi || '未知' },
                { label: '运营商', value: data.fuwushang || '未知' },
                { label: '区号', value: data.quhao || '未知' },
                { label: '邮编', value: data.youbian || '未知' },
                { label: '区划代码', value: data.qhdm || '未知' }
            ];
            
            let html = '';
            for (const info of infoMap) {
                html += `<div class="result-item">
                    <span class="result-label">${info.label}</span>
                    <span class="result-text">${info.value}</span>
                </div>`;
            }
            
            $('#phone-result').innerHTML = html;
        } else {
            const localResult = parsePhoneLocally(phone);
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
            $('#phone-result').innerHTML = html;
        }
    } catch (error) {
        const localResult = parsePhoneLocally(phone);
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
        $('#phone-result').innerHTML = html;
    }
}

const PHONE_PREFIX_MAP = {
    '134': { carrier: '中国移动', province: '全国' },
    '135': { carrier: '中国移动', province: '全国' },
    '136': { carrier: '中国移动', province: '全国' },
    '137': { carrier: '中国移动', province: '全国' },
    '138': { carrier: '中国移动', province: '全国' },
    '139': { carrier: '中国移动', province: '全国' },
    '147': { carrier: '中国移动', province: '全国' },
    '150': { carrier: '中国移动', province: '全国' },
    '151': { carrier: '中国移动', province: '全国' },
    '152': { carrier: '中国移动', province: '全国' },
    '157': { carrier: '中国移动', province: '全国' },
    '158': { carrier: '中国移动', province: '全国' },
    '159': { carrier: '中国移动', province: '全国' },
    '178': { carrier: '中国移动', province: '全国' },
    '182': { carrier: '中国移动', province: '全国' },
    '183': { carrier: '中国移动', province: '全国' },
    '184': { carrier: '中国移动', province: '全国' },
    '187': { carrier: '中国移动', province: '全国' },
    '188': { carrier: '中国移动', province: '全国' },
    '198': { carrier: '中国移动', province: '全国' },
    '130': { carrier: '中国联通', province: '全国' },
    '131': { carrier: '中国联通', province: '全国' },
    '132': { carrier: '中国联通', province: '全国' },
    '145': { carrier: '中国联通', province: '全国' },
    '155': { carrier: '中国联通', province: '全国' },
    '156': { carrier: '中国联通', province: '全国' },
    '166': { carrier: '中国联通', province: '全国' },
    '175': { carrier: '中国联通', province: '全国' },
    '176': { carrier: '中国联通', province: '全国' },
    '185': { carrier: '中国联通', province: '全国' },
    '186': { carrier: '中国联通', province: '全国' },
    '133': { carrier: '中国电信', province: '全国' },
    '149': { carrier: '中国电信', province: '全国' },
    '153': { carrier: '中国电信', province: '全国' },
    '173': { carrier: '中国电信', province: '全国' },
    '177': { carrier: '中国电信', province: '全国' },
    '180': { carrier: '中国电信', province: '全国' },
    '181': { carrier: '中国电信', province: '全国' },
    '189': { carrier: '中国电信', province: '全国' },
    '199': { carrier: '中国电信', province: '全国' },
    '170': { carrier: '虚拟运营商', province: '全国' },
    '171': { carrier: '虚拟运营商', province: '全国' }
};

function parsePhoneLocally(phone) {
    const prefix3 = phone.substring(0, 3);
    const prefix = PHONE_PREFIX_MAP[prefix3] || { carrier: '未知运营商', province: '全国' };
    
    return [
        { label: '号段', value: phone.substring(0, 7) },
        { label: '运营商', value: prefix.carrier },
        { label: '归属地', value: prefix.province }
    ];
}