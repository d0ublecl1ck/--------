// ==UserScript==
// @name         智能链接识别助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  识别选中文本中的链接并提供快捷跳转
// @author       D0ublecl1ck
// @match        https://*/*/*
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23000" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // 默认设置
    const DEFAULT_SETTINGS = {
        mode: 'popup' // 'popup' 或 'inline'
    };

    // 获取当前设置
    let settings = GM_getValue('settings', DEFAULT_SETTINGS);

    // 创建设置弹窗
    const settingsDialog = document.createElement('div');
    settingsDialog.id = 'url-settings-dialog';
    settingsDialog.innerHTML = `
        <div class="settings-content">
            <h2>设置</h2>
            <div class="setting-item">
                <label>
                    <input type="radio" name="mode" value="popup" ${settings.mode === 'popup' ? 'checked' : ''}>
                    弹窗模式 - 在选中文本旁显示弹窗
                </label>
            </div>
            <div class="setting-item">
                <label>
                    <input type="radio" name="mode" value="inline" ${settings.mode === 'inline' ? 'checked' : ''}>
                    内联模式 - 直接将文本转换为可点击链接
                </label>
            </div>
            <div class="button-group">
                <button id="settings-save">保存</button>
                <button id="settings-cancel">取消</button>
            </div>
        </div>
    `;
    document.body.appendChild(settingsDialog);

    // 添加设置弹窗样式
    GM_addStyle(`
        #url-settings-dialog {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 2147483647;
        }
        #url-settings-dialog .settings-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            min-width: 300px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        #url-settings-dialog h2 {
            margin: 0 0 20px 0;
            color: #333;
        }
        #url-settings-dialog .setting-item {
            margin: 15px 0;
            color: #333;
        }
        #url-settings-dialog .button-group {
            margin-top: 20px;
            text-align: right;
        }
        #url-settings-dialog button {
            padding: 8px 16px;
            margin-left: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        #url-settings-dialog #settings-save {
            background: #4CAF50;
            color: white;
        }
        #url-settings-dialog #settings-cancel {
            background: #f5f5f5;
            color: #333;
        }
    `);

    // 注册设置菜单
    GM_registerMenuCommand('⚙️ 打开设置', showSettings);

    // 显示设置弹窗
    function showSettings() {
        settingsDialog.style.display = 'flex';
        // 重置为当前设置
        const radios = settingsDialog.querySelectorAll('input[name="mode"]');
        radios.forEach(radio => {
            radio.checked = radio.value === settings.mode;
        });
    }

    // 保存设置
    document.getElementById('settings-save').addEventListener('click', () => {
        const selectedMode = settingsDialog.querySelector('input[name="mode"]:checked').value;
        settings.mode = selectedMode;
        GM_setValue('settings', settings);
        settingsDialog.style.display = 'none';
    });

    // 取消设置
    document.getElementById('settings-cancel').addEventListener('click', () => {
        settingsDialog.style.display = 'none';
    });

    // 点击遮罩层关闭设置
    settingsDialog.addEventListener('click', (e) => {
        if (e.target === settingsDialog) {
            settingsDialog.style.display = 'none';
        }
    });

    // 原有的弹窗代码...
    const popup = document.createElement('div');
    popup.id = 'url-popup';
    popup.style.cssText = `
        position: fixed;
        padding: 10px 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        border-radius: 5px;
        font-size: 14px;
        z-index: 2147483647;
        display: none;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        pointer-events: auto;
        user-select: none;
        min-width: 200px;
    `;
    document.body.appendChild(popup);

    // URL正则表达式
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*?)(?=[),\s]|$)/gi;

    // 内联模式：将文本转换为带链接的HTML
    function convertToLinks(text, matches) {
        let html = text;
        matches.forEach(url => {
            const fullUrl = !url.match(/^https?:\/\//i) ? 'https://' + url : url;
            html = html.replace(url, `<a href="${fullUrl}" target="_blank" style="color: #0066cc; text-decoration: underline;">${url}</a>`);
        });
        return html;
    }

    // 处理选中文本
    document.addEventListener('mouseup', function(e) {
        if (popup.contains(e.target)) {
            return;
        }

        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        if (!selectedText) {
            popup.style.display = 'none';
            return;
        }

        const matches = selectedText.match(urlRegex);
        
        if (matches && matches.length > 0) {
            if (settings.mode === 'popup') {
                // 弹窗模式
                handlePopupMode(matches, e);
            } else {
                // 内联模式
                handleInlineMode(selection, selectedText, matches);
            }
        } else {
            popup.style.display = 'none';
        }
    });

    // 处理弹窗模式
    function handlePopupMode(matches, e) {
        const urlList = matches.map(url => {
            if (!url.match(/^https?:\/\//i)) {
                url = 'https://' + url;
            }
            return url;
        });

        popup.innerHTML = urlList.map((url, index) => 
            `<div class="popup-item" data-url="${url}" style="margin: 5px 0; padding: 5px; border-bottom: ${index < urlList.length-1 ? '1px solid rgba(255,255,255,0.2)' : 'none'}">
                ${index + 1}. 点击跳转到: ${url}
            </div>`
        ).join('');

        popup.style.display = 'block';
        const x = Math.min(e.clientX, window.innerWidth - popup.offsetWidth - 20);
        const y = e.clientY + 20;
        popup.style.left = Math.max(10, x) + 'px';
        popup.style.top = y + 'px';

        const rect = popup.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
            popup.style.top = (e.clientY - popup.offsetHeight - 10) + 'px';
        }
    }

    // 处理内联模式
    function handleInlineMode(selection, selectedText, matches) {
        const range = selection.getRangeAt(0);
        const newNode = document.createElement('span');
        newNode.innerHTML = convertToLinks(selectedText, matches);
        range.deleteContents();
        range.insertNode(newNode);
        popup.style.display = 'none';
    }

    // 弹窗点击事件
    popup.addEventListener('click', function(e) {
        const item = e.target.closest('.popup-item');
        if (item) {
            const url = item.dataset.url;
            if (url) {
                popup.style.display = 'none';
                window.open(url, '_blank');
            }
        }
    });

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        #url-popup {
            font-family: Arial, sans-serif;
        }
        #url-popup .popup-item:hover {
            background: rgba(255, 255, 255, 0.1);
        }
    `;
    document.head.appendChild(style);
})(); 