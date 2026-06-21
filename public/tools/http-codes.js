const HTTP_CODES = [
    { code: 100, status: 'Continue', desc: '服务器已收到请求的头部，客户端可以继续发送请求体' },
    { code: 101, status: 'Switching Protocols', desc: '服务器正在切换协议' },
    { code: 200, status: 'OK', desc: '请求成功' },
    { code: 201, status: 'Created', desc: '资源已成功创建' },
    { code: 204, status: 'No Content', desc: '请求成功，但没有返回内容' },
    { code: 301, status: 'Moved Permanently', desc: '资源已永久移动到新位置' },
    { code: 302, status: 'Found', desc: '资源临时移动到新位置' },
    { code: 304, status: 'Not Modified', desc: '资源自上次请求后未修改，使用缓存版本' },
    { code: 400, status: 'Bad Request', desc: '服务器无法理解请求格式' },
    { code: 401, status: 'Unauthorized', desc: '请求需要用户认证' },
    { code: 403, status: 'Forbidden', desc: '服务器拒绝访问此资源' },
    { code: 404, status: 'Not Found', desc: '请求的资源不存在' },
    { code: 405, status: 'Method Not Allowed', desc: '不允许使用该 HTTP 方法' },
    { code: 408, status: 'Request Timeout', desc: '请求超时' },
    { code: 409, status: 'Conflict', desc: '请求与服务器状态冲突' },
    { code: 429, status: 'Too Many Requests', desc: '请求过于频繁，触发限流' },
    { code: 500, status: 'Internal Server Error', desc: '服务器内部错误' },
    { code: 502, status: 'Bad Gateway', desc: '网关或代理服务器收到无效响应' },
    { code: 503, status: 'Service Unavailable', desc: '服务器暂时不可用' },
    { code: 504, status: 'Gateway Timeout', desc: '网关超时' }
];

function renderHttpCodes() {
    let rows = HTTP_CODES.map(c => {
        const cat = Math.floor(c.code / 100);
        return `<tr>
            <td><span class="status-badge status-${cat}xx">${c.code}</span></td>
            <td><span class="http-method">${c.status}</span></td>
            <td>${c.desc}</td>
        </tr>`;
    }).join('');
    
    return `
        <div class="tool-card">
            <h3>搜索</h3>
            <div class="form-group search-input">
                <input type="text" id="http-search" placeholder="搜索状态码、状态或描述...">
            </div>
        </div>
        <div class="tool-card">
            <h3>HTTP 状态码参考表</h3>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>状态码</th>
                            <th>状态</th>
                            <th>描述</th>
                        </tr>
                    </thead>
                    <tbody id="http-table-body">
                        ${rows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function initHttpCodes() {
    document.addEventListener('input', (e) => {
        if (e.target.id === 'http-search') {
            const query = e.target.value.toLowerCase();
            const filtered = HTTP_CODES.filter(c => 
                c.code.toString().includes(query) ||
                c.status.toLowerCase().includes(query) ||
                c.desc.toLowerCase().includes(query)
            );
            
            const rows = filtered.map(c => {
                const cat = Math.floor(c.code / 100);
                return `<tr>
                    <td><span class="status-badge status-${cat}xx">${c.code}</span></td>
                    <td><span class="http-method">${c.status}</span></td>
                    <td>${c.desc}</td>
                </tr>`;
            }).join('');
            
            $('#http-table-body').innerHTML = rows || '<tr><td colspan="3" style="text-align: center;">未找到匹配的状态码</td></tr>';
        }
    });
}
