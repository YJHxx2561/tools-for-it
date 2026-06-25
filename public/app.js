const tools = {
    'token-generator': {
        title: 'Token 生成器',
        description: '生成各种类型的安全令牌',
        render: renderTokenGenerator
    },
    'uuid-generator': {
        title: 'UUID 生成器',
        description: '生成符合标准的 UUID',
        render: renderUuidGenerator
    },
    'mac-generator': {
        title: 'MAC 地址生成器',
        description: '生成随机 MAC 地址',
        render: renderMacGenerator
    },
    'random-port': {
        title: '随机端口生成器',
        description: '在指定范围内生成随机端口',
        render: renderRandomPort
    },
    'password-generator': {
        title: '密码生成器',
        description: '生成随机安全密码',
        render: renderPasswordGenerator
    },
    'rsa-key-generator': {
        title: 'RSA 密钥对生成器',
        description: '生成 RSA 私钥和公钥 PEM 证书',
        render: renderRSAKeyGenerator
    },
    'hash-text': {
        title: 'Hash 文本',
        description: '对文本进行多种哈希计算',
        render: renderHashText
    },
    'bcrypt-hash': {
        title: 'Bcrypt 哈希',
        description: '使用 PBKDF2 进行安全的密码哈希',
        render: renderBcryptHash
    },
    'encrypt-decrypt': {
        title: '加密/解密',
        description: '使用 Base64 和 URL 编码解码',
        render: renderEncryptDecrypt
    },
    'password-strength': {
        title: '密码强度分析',
        description: '分析密码的安全强度和破解时间',
        render: renderPasswordStrength,
        init: initPasswordStrength
    },
    'roman-numeral': {
        title: '罗马数字转换器',
        description: '数字与罗马数字相互转换',
        render: renderRomanNumeral
    },
    'docker-converter': {
        title: 'Docker Run to Compose 转换器',
        description: '将 Docker Run 命令转换为 Docker Compose 格式',
        render: renderDockerConverter
    },
    'subnet-calculator': {
        title: 'IPv4 子网计算器',
        description: '计算子网相关信息',
        render: renderSubnetCalculator
    },
    'http-codes': {
        title: 'HTTP 状态码',
        description: '查询 HTTP 状态码含义',
        render: renderHttpCodes,
        init: initHttpCodes
    },
    'device-info': {
        title: '设备信息',
        description: '获取当前设备详细信息',
        render: renderDeviceInfo
    },
    'user-agent': {
        title: '用户代理分析',
        description: '解析用户代理字符串',
        render: renderUserAgent
    },
    'qrcode-generator': {
        title: '二维码生成器',
        description: '将文本转换为二维码图片',
        render: renderQRCode
    },
    'github-mirror': {
        title: 'Github 加速下载',
        description: '通过加速镜像快速下载 GitHub 资源',
        render: renderGitHubMirror
    },
    'byte-calculator': {
        title: '字节计算器',
        description: '计算 bit, byte, KB, MB, GB, TB, PB 之间的换算',
        render: renderByteCalculator
    },
    'idcard-query': {
        title: '身份证归属地查询',
        description: '查询身份证号码的归属地、出生日期、性别等信息',
        render: renderIdCardQuery
    },
    'phone-query': {
        title: '手机归属地查询',
        description: '查询手机号码的归属地和运营商信息',
        render: renderPhoneQuery
    },
    'bankcard-query': {
        title: '银行卡归属地查询',
        description: '查询银行卡号的开户行、卡类型、归属地等信息',
        render: renderBankCardQuery
    },
    'icp-query': {
        title: 'ICP 备案查询',
        description: '查询域名的 ICP 备案信息',
        render: renderIcpQuery
    },
    'temp-mail': {
        title: '临时邮箱',
        description: '生成有效期10分钟的临时邮箱',
        render: renderTempMail
    },
    'whois-query': {
        title: 'WHOIS 查询',
        description: '查询域名的 WHOIS 注册信息',
        render: renderWhoisQuery
    },
    'status-code-check': {
        title: '网站状态码检测',
        description: '检测网址的 HTTP 状态码，支持国内、香港、美国节点',
        render: renderStatusCodeCheck
    },
    'ping-tool': {
        title: 'Ping 检测',
        description: '检测域名或IP的响应时间和地理位置信息',
        render: renderPingTool
    },
    'wechat-check': {
        title: '微信域名拦截检测',
        description: '检测网址是否被微信拦截',
        render: renderWechatCheck
    },
    'translator': {
        title: '文本翻译',
        description: '支持多种语言互译',
        render: renderTranslator
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const container = document.getElementById('tool-container');

    initTheme();

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const toolId = item.dataset.tool;
            if (tools[toolId]) {
                container.innerHTML = `<div class="tool-container">
                    <div class="tool-header">
                        <h2>${tools[toolId].title}</h2>
                        <p>${tools[toolId].description}</p>
                    </div>
                    ${tools[toolId].render()}
                </div>`;
                if (tools[toolId].init) {
                    tools[toolId].init();
                }
            }
            const sidebar = document.querySelector('.sidebar');
            if (sidebar.classList.contains('open')) {
                toggleSidebar();
            }
        });
    });

    container.innerHTML = `<div class="tool-container">
        <div class="tool-header">
            <h2>${tools['token-generator'].title}</h2>
            <p>${tools['token-generator'].description}</p>
        </div>
        ${tools['token-generator'].render()}
    </div>`;
});

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let theme = 'dark';
    if (savedTheme) {
        theme = savedTheme;
    } else if (prefersDark) {
        theme = 'dark';
    } else {
        theme = 'light';
    }
    
    setTheme(theme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeBtns = document.querySelectorAll('.theme-toggle, .theme-toggle-btn');
    themeBtns.forEach(btn => {
        btn.textContent = theme === 'dark' ? '🌙' : '☀️';
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    } else {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    }
}

function searchTools() {
    const keyword = document.getElementById('tool-search').value.toLowerCase().trim();
    const navMenu = document.getElementById('nav-menu');
    const searchResults = document.getElementById('search-results');
    const categories = navMenu.querySelectorAll('.nav-category');
    
    // 同时过滤侧边栏显示
    categories.forEach(category => {
        const items = category.querySelectorAll('.nav-item');
        let hasVisibleItem = false;
        
        items.forEach(item => {
            const toolId = item.dataset.tool;
            const tool = tools[toolId];
            if (tool) {
                const title = tool.title.toLowerCase();
                const desc = tool.description.toLowerCase();
                const match = keyword === '' || title.includes(keyword) || desc.includes(keyword);
                item.style.display = match ? '' : 'none';
                if (match) hasVisibleItem = true;
            }
        });
        
        category.style.display = hasVisibleItem ? '' : 'none';
    });
    
    // 显示搜索结果下拉列表
    if (keyword === '') {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        return;
    }
    
    let matched = [];
    for (const toolId in tools) {
        const tool = tools[toolId];
        if (tool.title.toLowerCase().includes(keyword) || tool.description.toLowerCase().includes(keyword)) {
            matched.push({ id: toolId, title: tool.title });
        }
    }
    
    if (matched.length === 0) {
        searchResults.innerHTML = '<div class="search-no-result">未找到匹配的工具</div>';
    } else {
        searchResults.innerHTML = matched.map(m => 
            `<div class="search-result-item" onclick="goToTool('${m.id}')">${m.title}</div>`
        ).join('');
    }
    searchResults.style.display = 'block';
}

function goToTool(toolId) {
    const container = document.getElementById('tool-container');
    const searchResults = document.getElementById('search-results');
    const searchInput = document.getElementById('tool-search');
    
    // 清除搜索状态
    searchResults.innerHTML = '';
    searchResults.style.display = 'none';
    searchInput.value = '';
    
    // 恢复侧边栏显示
    const navMenu = document.getElementById('nav-menu');
    const categories = navMenu.querySelectorAll('.nav-category');
    categories.forEach(category => {
        category.style.display = '';
        category.querySelectorAll('.nav-item').forEach(item => {
            item.style.display = '';
        });
    });
    
    // 高亮当前工具
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const targetItem = document.querySelector(`.nav-item[data-tool="${toolId}"]`);
    if (targetItem) {
        targetItem.classList.add('active');
        targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // 加载工具内容
    if (tools[toolId]) {
        container.innerHTML = `<div class="tool-container">
            <div class="tool-header">
                <h2>${tools[toolId].title}</h2>
                <p>${tools[toolId].description}</p>
            </div>
            ${tools[toolId].render()}
        </div>`;
        if (tools[toolId].init) {
            tools[toolId].init();
        }
    }
    
    // 移动端关闭侧边栏
    const sidebar = document.querySelector('.sidebar');
    if (sidebar.classList.contains('open')) {
        toggleSidebar();
    }
}

function handleSearchKeydown(event) {
    if (event.key === 'Enter') {
        const keyword = document.getElementById('tool-search').value.toLowerCase().trim();
        if (!keyword) return;
        
        for (const toolId in tools) {
            const tool = tools[toolId];
            if (tool.title.toLowerCase().includes(keyword) || tool.description.toLowerCase().includes(keyword)) {
                goToTool(toolId);
                break;
            }
        }
    }
}