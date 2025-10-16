/**
 * SillyTavern 角色卡导出工具扩展
 * 核心逻辑：获取当前角色数据并触发下载。
 */

// 移除 settings() 函数，因为 HTML 现在在 settings.html 中定义。

window.SillyTavern.registerExtension({
    // 扩展的内部名称
    name: 'CharacterCardExportTool',

    /**
     * 扩展初始化函数
     */
    init: function () {
        console.log('角色卡导出工具扩展已加载！');
    },

    // settings: function () { /* 此函数被移除，由 settings.html 代替 */ },

    /**
     * 设置面板渲染完成后的回调函数
     * 在这里绑定按钮的点击事件
     * 注意：这个函数会在 settings.html 的内容加载后立即执行
     */
    onSettingsLoaded: function () {
        const button = document.getElementById('export-char-card-button');
        if (button) {
            button.addEventListener('click', exportCurrentCharacterCard);
            console.log('角色卡导出按钮已绑定事件。');
        } else {
            console.error('未找到 ID 为 "export-char-card-button" 的按钮。请检查 settings.html 文件。');
        }
    }
});

/**
 * 负责获取当前角色并将其导出为 JSON 文件
 */
function exportCurrentCharacterCard() {
    // 使用全局变量获取 Context
    const context = window.SillyTavern.getContext();
    
    // 检查当前是否有角色加载
    if (!context || !context.current_character) {
        if (typeof toastr !== 'undefined') {
            toastr.warning('当前没有加载任何角色。', '导出失败');
        }
        console.warn('导出失败：context.current_character 为空。');
        return;
    }

    const character = context.current_character;

    try {
        // 1. 将角色对象转换为格式化的 JSON 字符串
        const cardData = JSON.stringify(character, null, 2);

        // 2. 生成文件名
        const date = new Date().toISOString().slice(0, 10);
        const safeName = character.name.replace(/[\\/:*?"<>|]/g, '_'); 
        const fileName = `${safeName}_${date}.json`;
        
        // 3. 创建 Blob 并触发下载
        const blob = new Blob([cardData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; 
        
        // 4. 触发下载
        setTimeout(() => {
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            if (typeof toastr !== 'undefined') {
                toastr.success(`角色卡已导出为: ${fileName}`, '导出成功');
            }
            console.log(`角色卡已成功导出为: ${fileName}`);
        }, 100); 

    } catch (error) {
        if (typeof toastr !== 'undefined') {
            toastr.error(`导出角色卡时发生错误: ${error.message}`, '导出失败');
        }
        console.error('导出角色卡时发生错误:', error);
    }
}
