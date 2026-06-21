function parseUserAgent(ua) {
    const result = {
        browser: { name: '未知', version: '' },
        engine: { name: '未知', version: '' },
        os: { name: '未知', version: '' },
        cpu: { name: '未知', architecture: '' },
        device: { type: '未知', model: '' }
    };
    
    if (!ua) return result;
    
    const uaLower = ua.toLowerCase();
    
    if (uaLower.includes('edge') || uaLower.includes('edg/')) {
        result.browser = { name: 'Microsoft Edge', version: extractVersion(ua, 'edg/') };
        result.engine = { name: 'Blink', version: '' };
    } else if (uaLower.includes('chrome') && !uaLower.includes('chromium')) {
        result.browser = { name: 'Google Chrome', version: extractVersion(ua, 'chrome/') };
        result.engine = { name: 'Blink', version: '' };
    } else if (uaLower.includes('firefox')) {
        result.browser = { name: 'Mozilla Firefox', version: extractVersion(ua, 'firefox/') };
        result.engine = { name: 'Gecko', version: extractVersion(ua, 'rv:') };
    } else if (uaLower.includes('safari') && !uaLower.includes('chrome')) {
        result.browser = { name: 'Safari', version: extractVersion(ua, 'version/') };
        result.engine = { name: 'WebKit', version: extractVersion(ua, 'applewebkit/') };
    } else if (uaLower.includes('opera') || uaLower.includes('opr/')) {
        result.browser = { name: 'Opera', version: extractVersion(ua, 'opr/') || extractVersion(ua, 'opera/') };
        result.engine = { name: 'Blink', version: '' };
    }
    
    if (uaLower.includes('windows')) {
        result.os = { name: 'Windows', version: extractWindowsVersion(ua) };
        if (uaLower.includes('win64') || uaLower.includes('x64') || uaLower.includes('wow64')) {
            result.cpu = { name: 'x64', architecture: 'x64' };
        } else if (uaLower.includes('win32')) {
            result.cpu = { name: 'x86', architecture: 'x86' };
        }
    } else if (uaLower.includes('mac os x') || uaLower.includes('macos')) {
        result.os = { name: 'macOS', version: extractMacOSVersion(ua) };
        if (uaLower.includes('arm64')) {
            result.cpu = { name: 'ARM64', architecture: 'arm64' };
        } else {
            result.cpu = { name: 'Intel', architecture: 'x64' };
        }
    } else if (uaLower.includes('linux')) {
        result.os = { name: 'Linux', version: '' };
        if (uaLower.includes('x86_64') || uaLower.includes('amd64')) {
            result.cpu = { name: 'x64', architecture: 'x64' };
        } else if (uaLower.includes('x86')) {
            result.cpu = { name: 'x86', architecture: 'x86' };
        } else if (uaLower.includes('arm') || uaLower.includes('aarch64')) {
            result.cpu = { name: 'ARM', architecture: 'arm' };
        }
    } else if (uaLower.includes('android')) {
        result.os = { name: 'Android', version: extractAndroidVersion(ua) };
        result.device = { type: '手机/平板', model: extractAndroidModel(ua) };
    } else if (uaLower.includes('iphone') || uaLower.includes('ipad') || uaLower.includes('ipod')) {
        result.os = { name: 'iOS', version: extractIOSVersion(ua) };
        result.device = { type: 'Apple 设备', model: extractiOSDevice(ua) };
    }
    
    if (uaLower.includes('mobile') || uaLower.includes('android') && !uaLower.includes('tablet')) {
        if (result.device.type === '未知') {
            result.device = { ...result.device, type: '手机' };
        }
    } else if (uaLower.includes('tablet') || uaLower.includes('ipad')) {
        result.device = { ...result.device, type: '平板' };
    }
    
    if (uaLower.includes('bot') || uaLower.includes('crawler') || uaLower.includes('spider')) {
        result.device = { type: '爬虫/机器人', model: '' };
    }
    
    return result;
}

function extractVersion(ua, pattern) {
    const match = ua.match(new RegExp(pattern + '(\\d+([.]\\d+)*)', 'i'));
    return match ? match[1] : '';
}

function extractWindowsVersion(ua) {
    const match = ua.match(/windows nt (\d+\.\d+)/i);
    if (!match) return '';
    const versions = { '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7', '6.0': 'Vista', '5.1': 'XP' };
    return versions[match[1]] || match[1];
}

function extractMacOSVersion(ua) {
    const match = ua.match(/mac os x (\d+[._]\d+[._]?\d*)/i);
    if (!match) return '';
    return match[1].replace(/_/g, '.');
}

function extractAndroidVersion(ua) {
    const match = ua.match(/android (\d+\.?\d*)/i);
    return match ? match[1] : '';
}

function extractAndroidModel(ua) {
    const match = ua.match(/android[^;]*;\s*([^)]+)\)/i);
    return match ? match[1].trim() : '';
}

function extractIOSVersion(ua) {
    const match = ua.match(/os (\d+[._]\d+[._]?\d*)/i);
    if (!match) return '';
    return match[1].replace(/_/g, '.');
}

function extractiOSDevice(ua) {
    if (ua.includes('iPhone')) return 'iPhone';
    if (ua.includes('iPad')) return 'iPad';
    if (ua.includes('iPod')) return 'iPod';
    return '';
}

const UA_PRESETS = {
    'chrome-windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'chrome-macos': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'chrome-linux': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'chrome-android': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'safari-ios': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'edge': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    'firefox': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'bot': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
};

function renderUserAgent() {
    const currentUA = navigator.userAgent;
    const parsed = parseUserAgent(currentUA);
    
    return `
        <div class="tool-card">
            <h3>当前用户代理</h3>
            <div class="form-group">
                <textarea id="ua-input">${currentUA}</textarea>
            </div>
            ${button('分析', "analyzeUA()")}
        </div>
        <div class="tool-card">
            <h3>解析结果</h3>
            <div class="info-grid" id="ua-results">
                <div class="info-item">
                    <div class="label">浏览器</div>
                    <div class="value">${parsed.browser.name} ${parsed.browser.version}</div>
                </div>
                <div class="info-item">
                    <div class="label">渲染引擎</div>
                    <div class="value">${parsed.engine.name} ${parsed.engine.version}</div>
                </div>
                <div class="info-item">
                    <div class="label">操作系统</div>
                    <div class="value">${parsed.os.name} ${parsed.os.version}</div>
                </div>
                <div class="info-item">
                    <div class="label">CPU 架构</div>
                    <div class="value">${parsed.cpu.name}</div>
                </div>
                <div class="info-item">
                    <div class="label">设备类型</div>
                    <div class="value">${parsed.device.type}</div>
                </div>
                <div class="info-item">
                    <div class="label">设备型号</div>
                    <div class="value">${parsed.device.model || '-'}</div>
                </div>
            </div>
        </div>
        <div class="tool-card">
            <h3>常见用户代理示例</h3>
            <div class="form-group">
                <select id="ua-presets" onchange="loadUAPreset()">
                    <option value="">-- 选择预设 --</option>
                    <option value="chrome-windows">Chrome on Windows</option>
                    <option value="chrome-macos">Chrome on macOS</option>
                    <option value="chrome-linux">Chrome on Linux</option>
                    <option value="chrome-android">Chrome on Android</option>
                    <option value="safari-ios">Safari on iOS</option>
                    <option value="edge">Microsoft Edge</option>
                    <option value="firefox">Firefox</option>
                    <option value="bot">爬虫/Bot</option>
                </select>
            </div>
        </div>
    `;
}

function loadUAPreset() {
    const preset = $('#ua-presets').value;
    if (preset && UA_PRESETS[preset]) {
        $('#ua-input').value = UA_PRESETS[preset];
        analyzeUA();
    }
}

function analyzeUA() {
    const ua = $('#ua-input').value;
    if (!ua.trim()) return;
    
    const parsed = parseUserAgent(ua);
    
    $('#ua-results').innerHTML = `
        <div class="info-item">
            <div class="label">浏览器</div>
            <div class="value">${parsed.browser.name} ${parsed.browser.version}</div>
        </div>
        <div class="info-item">
            <div class="label">渲染引擎</div>
            <div class="value">${parsed.engine.name} ${parsed.engine.version}</div>
        </div>
        <div class="info-item">
            <div class="label">操作系统</div>
            <div class="value">${parsed.os.name} ${parsed.os.version}</div>
        </div>
        <div class="info-item">
            <div class="label">CPU 架构</div>
            <div class="value">${parsed.cpu.name}</div>
        </div>
        <div class="info-item">
            <div class="label">设备类型</div>
            <div class="value">${parsed.device.type}</div>
        </div>
        <div class="info-item">
            <div class="label">设备型号</div>
            <div class="value">${parsed.device.model || '-'}</div>
        </div>
    `;
}
