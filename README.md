# DevTools - 开发者工具集

一个基于 Cloudflare Pages 部署的开发者工具集，包含多种常用工具，支持一键部署。

## 📦 工具列表

### 生成器
- 🔑 **Token 生成器** - 生成各种类型的安全令牌（JWT、API Key、Bearer Token），支持批量生成
- 🆔 **UUID 生成器** - 生成符合标准的 UUID（v1、v3、v4、v5），支持批量生成
- 📡 **MAC 地址生成器** - 生成随机 MAC 地址，支持常见厂商前缀（Cisco、Intel、VMware 等）
- 🔢 **随机端口生成器** - 在指定范围内生成随机端口，支持排除指定端口
- 🔐 **密码生成器** - 生成随机安全密码，可自定义字符集和长度，支持批量生成
- 🗝️ **RSA 密钥对生成器** - 生成 RSA 私钥和公钥 PEM 证书，可选择 2048/3072/4096 bits

### 加密与哈希
- #️⃣ **Hash 文本** - 支持 MD5、SHA-1、SHA-224、SHA-256、SHA-384、SHA-512、SHA-3、RIPEMD-160、FNV-1a、CRC32 等算法
- 🔒 **Bcrypt 哈希** - 使用 PBKDF2 进行安全的密码哈希，支持哈希生成和验证
- 🔏 **加密/解密** - 支持 Base64 编码解码、URL 编码解码
- 📊 **密码强度分析** - 分析密码的安全强度，提供熵值计算和破解时间估计（在线攻击、GPU加速、僵尸网络等场景）

### 转换器
- 🏛️ **罗马数字转换器** - 数字与罗马数字相互转换（支持 1-3999）
- 🐳 **Docker Run to Compose 转换器** - 将 Docker Run 命令转换为 Docker Compose 格式

### 计算器
- 🌐 **IPv4 子网计算器** - 计算子网相关信息（网络地址、广播地址、可用主机数等）

### 查询工具
- 📋 **HTTP 状态码** - 查询 HTTP 状态码含义，支持搜索过滤

### 设备与代理
- 💻 **设备信息** - 获取当前设备详细信息（屏幕大小、像素比率、用户代理、时区等）
- 🌍 **用户代理分析** - 解析用户代理字符串，识别浏览器、操作系统、设备类型

## 🚀 部署方式

### 方式一：GitHub 连接 Cloudflare Pages（推荐）

这是最简单的部署方式，直接将 GitHub 仓库连接到 Cloudflare Pages。

#### 步骤：

1. **创建 GitHub 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/tools-for-it.git
   git push -u origin main
   ```

2. **登录 Cloudflare Dashboard**
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 点击左侧菜单的 **Pages**

3. **创建项目**
   - 点击 **Create a project**
   - 选择 **Connect to Git**
   - 选择你的 GitHub 仓库
   - 点击 **Begin setup**

4. **配置构建设置**

   | 设置项 | 值 |
   |--------|-----|
   | **Framework preset** | `None` |
   | **Build command** | `npm run build` |
   | **Build output directory** | `dist` |
   | **Root directory** | `/` |

5. **部署**
   - 点击 **Save and Deploy**
   - 等待部署完成

#### 环境变量（可选）

如果需要自定义部署环境，可以在 Cloudflare Pages 设置中添加环境变量：

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NODE_VERSION` | Node.js 版本 | `20` |

### 方式二：本地开发与手动部署

#### 安装依赖
```bash
npm install
```

#### 本地开发
```bash
npm run dev
```
访问 http://localhost:8787

#### 构建
```bash
npm run build
```
构建产物将输出到 `dist` 目录

#### 手动部署
```bash
npm run deploy
```
需要先安装并登录 wrangler：
```bash
npm install -g wrangler
wrangler login
```

## 📁 项目结构

```
tools-for-it/
├── public/                    # 静态资源目录
│   ├── index.html            # 主页面
│   ├── styles.css            # 全局样式
│   ├── app.js                # 应用入口（工具注册中心）
│   ├── utils/                # 通用工具函数
│   │   └── helpers.js        # 辅助函数（DOM操作、复制、随机数等）
│   └── tools/                # 工具模块目录
│       ├── token-generator.js    # Token 生成器
│       ├── uuid-generator.js     # UUID 生成器
│       ├── mac-generator.js      # MAC 地址生成器
│       ├── random-port.js        # 随机端口生成器
│       ├── password-generator.js # 密码生成器
│       ├── rsa-key-generator.js  # RSA 密钥对生成器
│       ├── hash-text.js          # Hash 文本（多算法支持）
│       ├── bcrypt-hash.js        # Bcrypt 哈希
│       ├── encrypt-decrypt.js    # 加密/解密
│       ├── password-strength.js  # 密码强度分析（含破解时间估计）
│       ├── roman-numeral.js      # 罗马数字转换器
│       ├── docker-converter.js   # Docker 转换器
│       ├── subnet-calculator.js  # IPv4 子网计算器
│       ├── http-codes.js         # HTTP 状态码
│       ├── device-info.js        # 设备信息
│       └── user-agent.js         # 用户代理分析
├── dist/                     # 构建输出目录（自动生成）
├── scripts/                  # 构建脚本
│   └── build.js              # Node.js 构建脚本
├── wrangler.toml             # Cloudflare 配置文件
├── package.json              # 项目配置
├── .gitignore                # Git 忽略规则
└── README.md                 # 项目文档
```

## 🔧 添加新工具

添加新工具非常简单，只需以下步骤：

1. **创建工具模块文件**
   ```bash
   touch public/tools/my-new-tool.js
   ```

2. **实现工具逻辑**
   ```javascript
   function renderMyNewTool() {
       return `
           <div class="tool-card">
               <h3>我的新工具</h3>
               <!-- 工具内容 -->
           </div>
       `;
   }
   
   function myNewToolFunction() {
       // 工具功能实现
   }
   ```

3. **在 `app.js` 中注册工具**
   ```javascript
   const tools = {
       // ... 其他工具
       'my-new-tool': {
           title: '我的新工具',
           description: '工具描述',
           render: renderMyNewTool
       }
   };
   ```

4. **在 `index.html` 中添加导航和脚本引用**
   ```html
   <button class="nav-item" data-tool="my-new-tool">
       <span class="icon">🔧</span>
       <span>我的新工具</span>
   </button>
   ```
   ```html
   <script src="/tools/my-new-tool.js"></script>
   ```

## ⚙️ 配置文件说明

### wrangler.toml
```toml
name = "tools-for-it"
main = "index.html"
compatibility_date = "2024-01-01"

[build]
command = "npm run build"
publish = "dist"

[dev]
port = 8787
```

### package.json 脚本
| 脚本 | 说明 |
|------|------|
| `dev` | 本地开发服务器（端口 8787） |
| `build` | 构建项目到 `dist` 目录 |
| `deploy` | 部署到 Cloudflare Pages |

## 📝 开发规范

- 每个工具独立一个文件，放在 `public/tools/` 目录
- 通用函数放在 `public/utils/` 目录
- 使用 ES5 语法，确保兼容性
- 工具模块应导出 `render()` 函数用于渲染界面
- 如果需要初始化事件监听，导出 `init()` 函数
- 生成器类工具支持批量生成（数量选择）和单独复制功能

## 🎯 功能特性

- **批量生成**：Token、UUID、密码、端口等生成器支持批量生成
- **单独复制**：每个生成结果都有独立的复制按钮
- **复制全部**：一键复制所有生成结果
- **破解时间估计**：密码强度分析提供多种攻击场景的时间估计
- **多算法支持**：Hash 文本支持 11 种哈希算法
- **RSA 密钥生成**：支持 2048/3072/4096 bits 的 RSA 密钥对生成

## 📄 License

MIT