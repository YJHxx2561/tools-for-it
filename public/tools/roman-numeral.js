function renderRomanNumeral() {
    return `
        <div class="tool-card">
            <h3>数字转罗马数字</h3>
            <div class="form-group">
                <label>输入数字 (1-3999)</label>
                <input type="number" id="roman-number-input" placeholder="输入数字..." min="1" max="3999">
            </div>
            <div class="result-box" id="roman-to-result" style="text-align: center; font-size: 24px; min-height: 50px;"></div>
            <div style="margin-top: 12px;">
                ${button('转换', "convertToRoman()")}
                ${button('复制', "copyToClipboard($('#roman-to-result').textContent, this)", 'secondary')}
            </div>
        </div>
        
        <div class="tool-card">
            <h3>罗马数字转数字</h3>
            <div class="form-group">
                <label>输入罗马数字</label>
                <input type="text" id="roman-roman-input" placeholder="如: XIV, MMXXIV" style="text-transform: uppercase;">
            </div>
            <div class="result-box" id="roman-from-result" style="text-align: center; font-size: 24px; min-height: 50px;"></div>
            <div style="margin-top: 12px;">
                ${button('转换', "convertFromRoman()")}
                ${button('复制', "copyToClipboard($('#roman-from-result').textContent, this)", 'secondary')}
            </div>
        </div>
        
        <div class="tool-card">
            <h3>罗马数字对照表</h3>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>罗马数字</th>
                            <th>数值</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>I</td><td>1</td></tr>
                        <tr><td>V</td><td>5</td></tr>
                        <tr><td>X</td><td>10</td></tr>
                        <tr><td>L</td><td>50</td></tr>
                        <tr><td>C</td><td>100</td></tr>
                        <tr><td>D</td><td>500</td></tr>
                        <tr><td>M</td><td>1000</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

const ROMAN_VALUES = {
    'M': 1000, 'CM': 900, 'D': 500, 'CD': 400,
    'C': 100, 'XC': 90, 'L': 50, 'XL': 40,
    'X': 10, 'IX': 9, 'V': 5, 'IV': 4, 'I': 1
};

function convertToRoman() {
    const num = parseInt($('#roman-number-input').value);
    
    if (!num || num < 1 || num > 3999) {
        $('#roman-to-result').textContent = '请输入 1-3999 之间的数字';
        return;
    }
    
    let roman = '';
    let remaining = num;
    
    for (const [symbol, value] of Object.entries(ROMAN_VALUES)) {
        while (remaining >= value) {
            roman += symbol;
            remaining -= value;
        }
    }
    
    $('#roman-to-result').textContent = roman;
}

function convertFromRoman() {
    const roman = $('#roman-roman-input').value.toUpperCase().trim();
    
    if (!roman) {
        $('#roman-from-result').textContent = '请输入罗马数字';
        return;
    }
    
    // 验证罗马数字格式
    const validPattern = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
    if (!validPattern.test(roman)) {
        $('#roman-from-result').textContent = '无效的罗马数字格式';
        return;
    }
    
    let total = 0;
    let i = 0;
    
    while (i < roman.length) {
        // 检查两个字符的组合
        if (i + 1 < roman.length) {
            const twoChar = roman.substring(i, i + 2);
            if (ROMAN_VALUES[twoChar]) {
                total += ROMAN_VALUES[twoChar];
                i += 2;
                continue;
            }
        }
        
        // 单个字符
        const oneChar = roman[i];
        if (ROMAN_VALUES[oneChar]) {
            total += ROMAN_VALUES[oneChar];
            i += 1;
        } else {
            $('#roman-from-result').textContent = '无效的罗马数字';
            return;
        }
    }
    
    $('#roman-from-result').textContent = total.toString();
}