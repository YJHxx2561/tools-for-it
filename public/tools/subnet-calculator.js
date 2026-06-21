function ipToInt(ip) {
    const parts = ip.split('.').map(Number);
    return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
}

function intToIp(int) {
    return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');
}

function cidrToMask(cidr) {
    return ~(0xffffffff << (32 - cidr)) >>> 0;
}

function calculateSubnet(ip, cidr) {
    const ipInt = ipToInt(ip);
    const maskInt = cidrToMask(cidr);
    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | ~maskInt) >>> 0;
    const totalHosts = Math.pow(2, 32 - cidr) - 2;
    
    return {
        network: intToIp(networkInt),
        broadcast: intToIp(broadcastInt),
        firstUsable: cidr >= 31 ? intToIp(networkInt) : intToIp(networkInt + 1),
        lastUsable: cidr >= 31 ? intToIp(broadcastInt) : intToIp(broadcastInt - 1),
        totalHosts: totalHosts > 0 ? totalHosts : (cidr === 31 ? 2 : 0),
        subnetMask: intToIp(maskInt),
        wildcardMask: intToIp(~maskInt >>> 0),
        cidr: cidr,
        binaryMask: maskInt.toString(2).match(/.{1,8}/g).join('.')
    };
}

function renderSubnetCalculator() {
    return `
        <div class="tool-card">
            <h3>输入</h3>
            <div class="two-col">
                <div class="form-group">
                    <label>IP 地址</label>
                    <input type="text" id="subnet-ip" placeholder="192.168.1.1" value="192.168.1.0">
                </div>
                <div class="form-group">
                    <label>CIDR</label>
                    <input type="number" id="subnet-cidr" min="1" max="32" value="24">
                </div>
            </div>
            ${button('计算', "calculateSubnet()")}
        </div>
        <div class="tool-card">
            <h3>结果</h3>
            <div id="subnet-results"></div>
        </div>
    `;
}

function calculateSubnet() {
    const ip = $('#subnet-ip').value;
    const cidr = parseInt($('#subnet-cidr').value) || 24;
    
    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
        $('#subnet-results').innerHTML = '<p style="color: var(--danger);">请输入有效的 IP 地址</p>';
        return;
    }
    
    const result = calculateSubnet(ip, cidr);
    
    $('#subnet-results').innerHTML = `
        <div class="info-grid">
            <div class="info-item">
                <div class="label">网络地址</div>
                <div class="value">${result.network}/${result.cidr}</div>
            </div>
            <div class="info-item">
                <div class="label">广播地址</div>
                <div class="value">${result.broadcast}</div>
            </div>
            <div class="info-item">
                <div class="label">子网掩码</div>
                <div class="value">${result.subnetMask}</div>
            </div>
            <div class="info-item">
                <div class="label">通配符掩码</div>
                <div class="value">${result.wildcardMask}</div>
            </div>
            <div class="info-item">
                <div class="label">第一个可用 IP</div>
                <div class="value">${result.firstUsable}</div>
            </div>
            <div class="info-item">
                <div class="label">最后一个可用 IP</div>
                <div class="value">${result.lastUsable}</div>
            </div>
            <div class="info-item">
                <div class="label">可用主机数</div>
                <div class="value">${result.totalHosts}</div>
            </div>
            <div class="info-item">
                <div class="label">二进制掩码</div>
                <div class="value" style="font-size: 12px;">${result.binaryMask}</div>
            </div>
        </div>
    `;
}
