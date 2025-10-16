/**
 * SillyTavern 自动导出角色卡扩展
 * 监听 'characterLoaded' 事件，并在每次加载新角色时自动导出其 JSON 数据。
 */
window.SillyTavern.registerExtension({
    // 扩展的内部名称
    name: 'AutoExportCharacterCard',

    /**
     * 扩展初始化函数
     */
    init: function () {
        console.log('自动导出角色卡扩展已加载！');

        // 监听 'characterLoaded' 事件
        // 当用户加载或切换角色时，此事件会被触发，并传入角色对象 (character)
        window.SillyTavern.on('characterLoaded', function (character) {
            if (character && character.name) {
                console.log(`角色 "${character.name}" 已加载。正在自动导出角色卡...`);
                // 调用导出函数
                exportCharacterCard(character);
            }
        });
    }
});

/**
 * 负责将角色对象导出为 JSON 文件并触发下载
 * @param {object} character - 从 SillyTavern API 接收的角色对象
 */
function exportCharacterCard(character) {
    // 1. 将角色对象转换为格式化的 JSON 字符串
    // null, 2 用于美化输出的 JSON 格式
    const cardData = JSON.stringify(character, null, 2);

    // 2. 生成文件名
    // 文件名格式为：[角色名]_YYYY-MM-DD.json
    const date = new Date().toISOString().slice(0, 10);
    // 替换掉文件名中不允许的字符
    const safeName = character.name.replace(/[\\/:*?"<>|]/g, '_'); 
    const fileName = `${safeName}_${date}.json`;
    
    // 3. 使用浏览器的 Blob 和 URL API 触发下载

    // 创建一个 Blob 对象，MIME 类型为 JSON
    const blob = new Blob([cardData], { type: 'application/json' });
    // 创建一个临时的对象 URL
    const url = URL.createObjectURL(blob);

    // 创建一个隐藏的下载链接元素
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // 设置下载的文件名
    
    // 4. 触发下载
    document.body.appendChild(a);
    a.click();
    
    // 5. 清理（移除元素和释放 URL）
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`角色卡已成功导出为: ${fileName}`);
}
