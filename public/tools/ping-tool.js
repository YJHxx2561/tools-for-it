function renderPingTool() {
    return `
        <div class="tool-card">
            <h3>Ping 检测</h3>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
                检测域名或IP的响应时间和地理位置信息
            </p>
            <div class="form-group">
                <label>检测地址</label>
                <input type="text" id="ping-host" placeholder="域名或IP，例如: www.apihz.cn">
            </div>
            <div class="form-group">
                <label>检测节点</label>
                <select id="ping-type">
                    <option value="1">国内节点</option>
                    <option value="2">香港节点</option>
                    <option value="3">美国节点</option>
                </select>
            </div>
        </div>
        <div class="tool-card">
            <h3>检测结果</h3>
            <div id="ping-result" class="result-list">
                <div class="result-placeholder">输入地址后点击检测按钮</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('开始检测', "startPing()")}
        </div>
    `;
}

async function startPing() {
    const host = $('#ping-host').value.trim();
    const type = $('#ping-type').value;
    
    if (!host) {
        $('#ping-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">请输入检测地址</div>';
        return;
    }
    
    $('#ping-result').innerHTML = '<div class="result-placeholder">正在检测...</div>';
    
    try {
        const data = await fetchWithBackupKey(`https://cn.apihz.cn/api/wangzhan/ping.php?id=88888888&key=88888888&host=${encodeURIComponent(host)}&type=${type}`);
        
        if (data.code === 200) {
            const infoMap = [
                { label: '检测地址', value: data.host },
                { label: '实际地址', value: data.realhost || '-' },
                { label: 'IP地址', value: data.ip },
                { label: '响应时间', value: data.time + ' ms' },
                { label: '检测节点', value: data.dy + ' - ' + data.dz },
                { label: '地理位置', value: data.pdz || `${data.zhou}-${data.guo}-${data.sheng}-${data.shi}` },
                { label: '运营商', value: data.isp || '-' },
                { label: '经纬度', value: data.lat && data.lon ? `${data.lat}, ${data.lon}` : '-' }
            ];
            
            let html = '';
            for (const info of infoMap) {
                html += `<div class="result-item">
                    <span class="result-label">${info.label}</span>
                    <span class="result-text">${info.value}</span>
                </div>`;
            }
            
            $('#ping-result').innerHTML = html;
        } else {
            $('#ping-result').innerHTML = `<div class="result-placeholder" style="color: var(--danger);">检测失败：${data.msg || '未知错误'}</div>`;
        }
    } catch (error) {
        $('#ping-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">检测失败，请检查网络连接</div>';
    }
}