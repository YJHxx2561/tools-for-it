function renderGitHubMirror() {
    return `
        <div class="tool-card">
            <h3>Github 加速下载</h3>
            <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">
                在 GitHub 链接前添加加速域名，加快下载速度
            </p>
            <div class="form-group">
                <label>选择加速站</label>
                <select id="github-mirror-select">
                    <option value="https://github.web.yjhup.com/">github.web.yjhup.com (推荐)</option>
                    <option value="https://jsdelivr.net.aliyuncs.com/gh/">jsdelivr.net.aliyuncs.com</option>
                    <option value="https://cdn.jsdelivr.net/gh/">cdn.jsdelivr.net</option>
                    <option value="https://fastly.jsdelivr.net/gh/">fastly.jsdelivr.net</option>
                    <option value="https://testingcf.jsdelivr.net/gh/">testingcf.jsdelivr.net</option>
                    <option value="https://gh-proxy.com/">gh-proxy.com</option>
                    <option value="https://mirror.ghproxy.com/">mirror.ghproxy.com</option>
                    <option value="https://gh.llkk.cc/">gh.llkk.cc</option>
                </select>
            </div>
            <div class="form-group">
                <label>GitHub 链接</label>
                <input type="text" id="github-url-input" placeholder="例如: https://github.com/user/repo/archive/refs/heads/main.zip">
            </div>
        </div>
        <div class="tool-card">
            <h3>加速结果</h3>
            <div id="github-result" class="result-box" style="word-break: break-all;">
                <div class="result-placeholder">输入 GitHub 链接后点击转换按钮</div>
            </div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('转换', "convertGitHubUrl()")}
            ${button('复制链接', "copyGitHubUrl()", 'secondary')}
            ${button('直接打开', "openGitHubUrl()", 'secondary')}
        </div>
    `;
}

function convertGitHubUrl() {
    const mirror = $('#github-mirror-select').value;
    let url = $('#github-url-input').value.trim();
    
    if (!url) {
        $('#github-result').innerHTML = '<div class="result-placeholder" style="color: var(--danger);">请输入 GitHub 链接</div>';
        return;
    }
    
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    
    let convertedUrl;
    
    if (url.includes('github.com') && url.includes('/releases/download/')) {
        convertedUrl = mirror + url.replace('https://github.com/', '').replace('/releases/download/', '/');
    } else if (url.includes('github.com')) {
        const match = url.match(/github\.com\/([^\/]+\/[^\/]+)(?:\/(tree|blob)\/([^\/]+)(.+))?/);
        if (match) {
            const [, repoPath, , branch, ...pathParts] = match;
            if (branch && pathParts.length > 0) {
                convertedUrl = mirror + repoPath + '/' + branch + pathParts.join('');
            } else {
                convertedUrl = mirror + repoPath;
            }
        } else {
            convertedUrl = mirror + url.replace('https://github.com/', '');
        }
    } else {
        convertedUrl = mirror + url;
    }
    
    convertedUrl = convertedUrl.replace(/\/$/, '');
    
    $('#github-result').innerHTML = `<div style="font-size: 14px; color: var(--text-primary); word-break: break-all;">${convertedUrl}</div>`;
}

function copyGitHubUrl() {
    const result = $('#github-result').querySelector('div');
    if (!result || result.classList.contains('result-placeholder')) {
        return;
    }
    copyToClipboard(result.textContent);
}

function openGitHubUrl() {
    const result = $('#github-result').querySelector('div');
    if (!result || result.classList.contains('result-placeholder')) {
        return;
    }
    window.open(result.textContent, '_blank');
}
