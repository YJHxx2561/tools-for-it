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
            toggleSidebar();
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