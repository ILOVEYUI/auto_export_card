/**
 * SillyTavern 角色卡导出工具扩展
 * 在扩展设置面板中添加一个按钮，用于导出当前角色的 JSON 数据。
 */
import { getContext } from '../../extensions.js';

window.SillyTavern.registerExtension({
    // 扩展的内部名称
    name: 'CharacterCardExportTool',

    /**
     * 扩展初始化函数
     */
    init: function () {
        console.log('角色卡导出工具扩展已加载！');
    },

    /**
     * 添加扩展设置面板的 HTML 结构
     * @returns {string} HTML 字符串
     */
    settings: function () {
        // 创建一个按钮，并绑定一个点击事件（使用内联 onclick 调用全局函数）
        // 注意：为避免污染全局命名空间，我们应该将函数绑定到事件监听器，
        // 但为了简化，这里使用 window.SillyTavern.extension_api.[extension_name].exportCurrentCard
        const html = `
            <div class="extension-settings-block">
                <div class="inline-label">
                    <span>当前角色卡导出</span>
                </div>
                <div class="inline-block">
                    <button 
                        id="export-char-card-button" 
                        class="menu_button" 
                        title="导出当前正在聊天的角色卡为 JSON 文件"
                    >
                        下载当前角色卡 (.json)
                    </button>
                </div>
                <div class="info_block">
                    点击按钮导出当前角色（如角色定义、世界信息等）的 JSON 文件。
                </div>
            </div>
        `;
        return html;
    },

    /**
     * 设置面板渲染完成后的回调函数
     * 在这里绑定按钮的点击事件
     */
    onSettingsLoaded: function () {
        const button = document.getElementById('export-char-card-button');
        if (button) {
            button.addEventListener('click', exportCurrentCharacterCard);
        }
    }
});

/**
 * 负责获取当前角色并将其导出为 JSON 文件
 */
function exportCurrentCharacterCard() {
    // 确保有 getContext 函数可用
    const context = getContext ? getContext() : window.SillyTavern.getContext();
    
    // 检查当前是否有角色加载
    if (!context.current_character) {
        toastr.warning('当前没有加载任何角色。', '导出失败');
        console.warn('导出失败：context.current_character 为空。');
        return;
    }

    const character = context.current_character;

    try {
        // 1. 将角色对象转换为格式化的 JSON 字符串
        const cardData = JSON.stringify(character, null, 2);

        // 2. 生成文件名
        const date = new Date().toISOString().slice(0, 10);
        // 替换掉文件名中不允许的字符
        const safeName = character.name.replace(/[\\/:*?"<>|]/g, '_'); 
        const fileName = `${safeName}_${date}.json`;
        
        // 3. 创建 Blob 并触发下载
        const blob = new Blob([cardData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; // 设置下载的文件名
        
        // 4. 触发下载
        // 延迟执行可以提高下载成功率，避免被某些浏览器优化阻止
        setTimeout(() => {
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toastr.success(`角色卡已导出为: ${fileName}`, '导出成功');
            console.log(`角色卡已成功导出为: ${fileName}`);
        }, 100); 

    } catch (error) {
        toastr.error(`导出角色卡时发生错误: ${error.message}`, '导出失败');
        console.error('导出角色卡时发生错误:', error);
    }
}
