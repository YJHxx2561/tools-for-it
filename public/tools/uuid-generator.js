function renderUuidGenerator() {
    return `
        <div class="tool-card">
            <h3>配置</h3>
            ${selectField('uuid-version', 'UUID 版本', [
                { value: 'v4', label: 'UUID v4 (随机)' },
                { value: 'v1', label: 'UUID v1 (时间戳)' },
                { value: 'v7', label: 'UUID v7 (时间排序)' }
            ])}
            <div class="form-group">
                <label>数量</label>
                <input type="number" id="uuid-count" value="5" min="1" max="100">
            </div>
        </div>
        <div class="tool-card">
            <h3>生成结果</h3>
            <div class="result-box" id="uuid-result" style="max-height: 400px; overflow-y: auto;"></div>
        </div>
        <div style="display: flex; gap: 12px;">
            ${button('生成', "generateUUIDs()")}
            ${button('复制全部', "copyToClipboard($('#uuid-result').textContent, this)", 'secondary')}
        </div>
    `;
}

function generateUUIDv4() {
    const bytes = generateRandomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = arrayToHex(bytes);
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

function generateUUIDv1() {
    const now = Date.now();
    const clockSeq = (Math.random() * 0x3fff) | 0;
    const timeLow = now & 0xffffffff;
    const timeMid = (now >> 32) & 0xffff;
    const timeHigh = ((now >> 48) & 0x0fff) | 0x1000;
    const node = generateRandomBytes(6);
    const hex = arrayToHex(node);
    return `${timeLow.toString(16).padStart(8, '0')}-${timeMid.toString(16).padStart(4, '0')}-${timeHigh.toString(16).padStart(4, '0')}-${clockSeq.toString(16).padStart(4, '0')}-${hex}`;
}

function generateUUIDv7() {
    const now = Date.now();
    const random = generateRandomBytes(10);
    const timeHigh = ((now >> 16) & 0x0fff) | 0x7000;
    const timeMid = now & 0xffff;
    const hex = arrayToHex(random);
    return `${timeHigh.toString(16).padStart(4, '0')}${timeMid.toString(16).padStart(4, '0')}-${hex.slice(0,4)}-${hex.slice(4,8)}-${hex.slice(8,12)}-${hex.slice(12)}`;
}

function generateUUIDs() {
    const version = $('#uuid-version').value;
    const count = parseInt($('#uuid-count').value) || 5;
    const generators = { v4: generateUUIDv4, v1: generateUUIDv1, v7: generateUUIDv7 };
    const uuids = [];
    for (let i = 0; i < Math.min(count, 100); i++) {
        uuids.push(generators[version]());
    }
    $('#uuid-result').textContent = uuids.join('\n');
}
