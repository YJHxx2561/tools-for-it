function parseDockerRunCommand(command) {
    const result = {
        image: '',
        name: '',
        ports: [],
        volumes: [],
        environment: [],
        restart: 'no',
        detach: true,
        command: []
    };
    
    const parts = command.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    let i = 0;
    
    while (i < parts.length) {
        const part = parts[i].replace(/^"|"$/g, '');
        
        if (part === '-d' || part === '--detach') {
            result.detach = true;
        } else if (part === '--name') {
            result.name = parts[++i].replace(/^"|"$/g, '');
        } else if (part === '-p' || part === '--publish') {
            const portMapping = parts[++i].replace(/^"|"$/g, '');
            result.ports.push(portMapping);
        } else if (part === '-v' || part === '--volume') {
            const volume = parts[++i].replace(/^"|"$/g, '');
            result.volumes.push(volume);
        } else if (part === '-e' || part === '--env') {
            const env = parts[++i].replace(/^"|"$/g, '');
            result.environment.push(env);
        } else if (part === '--env-file') {
            result.envFile = parts[++i].replace(/^"|"$/g, '');
        } else if (part === '--restart') {
            result.restart = parts[++i].replace(/^"|"$/g, '');
        } else if (part === '-it') {
        } else if (!part.startsWith('-') && !result.image) {
            result.image = part;
        } else if (part.startsWith('-')) {
            i++;
        } else {
            result.command.push(part);
        }
        i++;
    }
    
    return result;
}

function dockerToCompose(parsed) {
    const lines = ['version: "3.8"', '', 'services:'];
    lines.push(`  ${parsed.name || 'app'}:`);
    lines.push(`    image: ${parsed.image}`);
    
    if (parsed.name) {
        lines.push(`    container_name: ${parsed.name}`);
    }
    
    if (parsed.ports.length > 0) {
        lines.push('    ports:');
        for (const p of parsed.ports) {
            const [host, container] = p.split(':');
            if (container.includes('-')) {
                lines.push(`      - "${host}:${container}"`);
            } else {
                lines.push(`      - "${p}"`);
            }
        }
    }
    
    if (parsed.volumes.length > 0) {
        lines.push('    volumes:');
        for (const v of parsed.volumes) {
            lines.push(`      - ${v}`);
        }
    }
    
    if (parsed.environment.length > 0) {
        lines.push('    environment:');
        for (const e of parsed.environment) {
            if (e.includes('=')) {
                const [key, ...vals] = e.split('=');
                lines.push(`      ${key}: "${vals.join('=')}"`);
            } else {
                lines.push(`      ${e}:`);
            }
        }
    }
    
    if (parsed.restart && parsed.restart !== 'no') {
        lines.push(`    restart: ${parsed.restart}`);
    }
    
    return lines.join('\n');
}

function renderDockerConverter() {
    return `
        <div class="tool-card">
            <h3>输入 Docker Run 命令</h3>
            <div class="form-group">
                <textarea id="docker-input" placeholder="输入 Docker Run 命令，例如：docker run -d --name nginx -p 80:80 -v /data:/usr/share/nginx/html nginx:latest"></textarea>
            </div>
            ${button('转换为 Compose', "convertDocker()")}
        </div>
        <div class="tool-card">
            <h3>Docker Compose 输出</h3>
            <div class="code-output" id="docker-output"></div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('复制', "copyToClipboard($('#docker-output').textContent, this)", 'secondary')}
            ${button('清空', "clearDocker()", 'secondary')}
        </div>
    `;
}

function convertDocker() {
    const input = $('#docker-input').value;
    if (!input) {
        $('#docker-output').textContent = '请输入 Docker Run 命令';
        return;
    }
    
    try {
        const parsed = parseDockerRunCommand(input);
        if (!parsed.image) {
            $('#docker-output').textContent = '错误: 未找到镜像名称';
            return;
        }
        const compose = dockerToCompose(parsed);
        $('#docker-output').textContent = compose;
    } catch (e) {
        $('#docker-output').textContent = '解析错误: ' + e.message;
    }
}

function clearDocker() {
    $('#docker-input').value = '';
    $('#docker-output').textContent = '';
}
