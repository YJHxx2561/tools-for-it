function renderIdCardQuery() {
    return `
        <div class="tool-card">
            <h3>身份证归属地查询</h3>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
                根据身份证号码查询归属地、出生日期、性别等信息
            </p>
            <div class="form-group">
                <label>身份证号码</label>
                <input type="text" id="idcard-input" placeholder="输入18位或15位身份证号码" maxlength="18">
            </div>
        </div>
        <div class="tool-card">
            <h3>查询结果</h3>
            <div id="idcard-result" class="result-list">
                <div class="result-placeholder">输入身份证号码后点击查询按钮</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('查询', "queryIdCard()")}
        </div>
    `;
}

async function queryIdCard() {
    const idcard = $('#idcard-input').value.trim();
    
    if (!idcard) {
        $('#idcard-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">请输入身份证号码</div>';
        return;
    }
    
    if (!/^\d{15}$|^\d{17}[\dXx]$/.test(idcard)) {
        $('#idcard-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">身份证号码格式不正确</div>';
        return;
    }
    
    $('#idcard-result').innerHTML = '<div class="result-placeholder">正在查询...</div>';
    
    try {
        const data = await fetchWithBackupKey(`https://cn.apihz.cn/api/other/card.php?id=88888888&key=88888888&card=${idcard}`);
        
        if (data.code === 200) {
            let html = '';
            
            const infoMap = [
                { label: '省份', value: data.sheng || '未知' },
                { label: '城市', value: data.shi || '未知' },
                { label: '区县', value: data.xian || '未知' }
            ];
            
            // 从身份证号码解析出生日期、性别、年龄
            let birthYear, birthMonth, birthDay, gender;
            if (idcard.length === 18) {
                birthYear = idcard.substring(6, 10);
                birthMonth = idcard.substring(10, 12);
                birthDay = idcard.substring(12, 14);
                gender = parseInt(idcard.charAt(16)) % 2 === 0 ? '女' : '男';
            } else {
                birthYear = '19' + idcard.substring(6, 8);
                birthMonth = idcard.substring(8, 10);
                birthDay = idcard.substring(10, 12);
                gender = parseInt(idcard.charAt(14)) % 2 === 0 ? '女' : '男';
            }
            
            infoMap.push(
                { label: '出生日期', value: `${birthYear}-${birthMonth}-${birthDay}` },
                { label: '性别', value: gender },
                { label: '年龄', value: calculateAge(birthYear, birthMonth, birthDay) }
            );
            
            for (const info of infoMap) {
                html += `<div class="result-item">
                    <span class="result-label">${info.label}</span>
                    <span class="result-text">${info.value}</span>
                </div>`;
            }
            
            $('#idcard-result').innerHTML = html;
        } else {
            const localResult = parseIdCardLocally(idcard);
            if (localResult) {
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
                $('#idcard-result').innerHTML = html;
            } else {
                $('#idcard-result').innerHTML = `<div class="result-placeholder" style="color: var(--danger);">查询失败：${data.msg || '未知错误'}</div>`;
            }
        }
    } catch (error) {
        const localResult = parseIdCardLocally(idcard);
        if (localResult) {
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
            $('#idcard-result').innerHTML = html;
        } else {
            $('#idcard-result').innerHTML = `<div class="result-placeholder" style="color: var(--danger);">查询失败，请检查网络连接</div>`;
        }
    }
}

function parseIdCardLocally(idcard) {
    const areaCode = idcard.substring(0, 6);
    const areaMap = {
        '110000': { province: '北京市', city: '北京市', town: '' },
        '110100': { province: '北京市', city: '北京市', town: '东城区' },
        '110200': { province: '北京市', city: '北京市', town: '西城区' },
        '110500': { province: '北京市', city: '北京市', town: '朝阳区' },
        '310000': { province: '上海市', city: '上海市', town: '' },
        '440100': { province: '广东省', city: '广州市', town: '' },
        '440300': { province: '广东省', city: '深圳市', town: '' },
        '330100': { province: '浙江省', city: '杭州市', town: '' },
        '320500': { province: '江苏省', city: '苏州市', town: '' },
        '510100': { province: '四川省', city: '成都市', town: '' }
    };
    
    const area = areaMap[areaCode] || { province: '未知', city: '未知', town: '未知' };
    
    let birthYear, birthMonth, birthDay, gender;
    if (idcard.length === 18) {
        birthYear = idcard.substring(6, 10);
        birthMonth = idcard.substring(10, 12);
        birthDay = idcard.substring(12, 14);
        gender = parseInt(idcard.charAt(16)) % 2 === 0 ? '女' : '男';
    } else {
        birthYear = '19' + idcard.substring(6, 8);
        birthMonth = idcard.substring(8, 10);
        birthDay = idcard.substring(10, 12);
        gender = parseInt(idcard.charAt(14)) % 2 === 0 ? '女' : '男';
    }
    
    return [
        { label: '省份', value: area.province },
        { label: '城市', value: area.city },
        { label: '区县', value: area.town },
        { label: '出生日期', value: `${birthYear}-${birthMonth}-${birthDay}` },
        { label: '性别', value: gender },
        { label: '年龄', value: calculateAge(birthYear, birthMonth, birthDay) }
    ];
}

function calculateAge(year, month, day) {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age + ' 岁';
}