const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// 添加消息到界面
function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
    div.innerText = text;
    chatBox.appendChild(div);
    // 自动滚动到底部
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 处理回车发送
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// 发送消息的主逻辑
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. 显示用户消息
    addMessage(text, 'user');
    userInput.value = '';

    // 2. 禁用按钮防止重复点击
    sendBtn.disabled = true;
    sendBtn.innerText = "思考中...";

    try {
        // 3. 发送请求给后端
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        if (data.success) {
            // 4. 显示 AI 回复
            addMessage(data.reply, 'ai');
        } else {
            addMessage("出错了：" + (data.error || "未知错误"), 'ai');
        }

    } catch (error) {
        addMessage("网络错误，请检查服务器。", 'ai');
        console.error(error);
    } finally {
        // 5. 恢复按钮状态
        sendBtn.disabled = false;
        sendBtn.innerText = "发送";
    }
}