function getDeviceInfo() {
    const ua = navigator.userAgent;
    const screen = window.screen;
    const navigator2 = window.navigator;
    
    const info = {
        '用户代理': ua,
        '平台': navigator2.platform || '未知',
        '语言': navigator2.language || '未知',
        'Cookie启用': navigator2.cookieEnabled ? '是' : '否',
        '在线状态': navigator2.onLine ? '在线' : '离线',
        '屏幕宽度': screen.width + ' px',
        '屏幕高度': screen.height + ' px',
        '可用屏幕宽度': screen.availWidth + ' px',
        '可用屏幕高度': screen.availHeight + ' px',
        '颜色深度': screen.colorDepth + ' bit',
        '像素比率': window.devicePixelRatio || '未知',
        '窗口宽度': window.innerWidth + ' px',
        '窗口高度': window.innerHeight + ' px',
        '方向': screen.orientation?.type || '不支持',
        '时区': Intl.DateTimeFormat().resolvedOptions().timeZone || '未知',
        '触控设备': navigator2.maxTouchPoints > 0 ? '是' : '否',
        '触控点数': navigator2.maxTouchPoints || 0,
        '硬件并发': navigator2.hardwareConcurrency || '未知',
        '设备内存': (navigator2.deviceMemory || '不支持') + ' GB'
    };
    
    return info;
}

function renderDeviceInfo() {
    const info = getDeviceInfo();
    const items = Object.entries(info).map(([label, value]) => `
        <div class="info-item">
            <div class="label">${label}</div>
            <div class="value" style="font-size: 13px; word-break: break-all;">${value}</div>
        </div>
    `).join('');
    
    return `
        <div class="tool-card">
            <h3>设备信息</h3>
            <div class="info-grid">
                ${items}
            </div>
        </div>
        <div class="tool-card">
            ${button('刷新', "refreshDeviceInfo()", 'secondary')}
        </div>
    `;
}

function refreshDeviceInfo() {
    const info = getDeviceInfo();
    const container = $('#tool-container');
    const items = Object.entries(info).map(([label, value]) => `
        <div class="info-item">
            <div class="label">${label}</div>
            <div class="value" style="font-size: 13px; word-break: break-all;">${value}</div>
        </div>
    `).join('');
    
    container.querySelector('.info-grid').innerHTML = items;
}
