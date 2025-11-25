from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv

# 加载 .env 文件中的环境变量
load_dotenv()

app = Flask(__name__)

# 初始化 OpenAI 客户端
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL")
)

@app.route('/')
def index():
    # 访问主页时，返回 index.html
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # 获取前端发送的数据
        data = request.json
        user_message = data.get('message')
        
        # 简单的上下文历史（生产环境建议存在数据库）
        # 这里为了演示，我们只发当前这一句，或者你可以让前端把历史传过来
        messages = [
            {"role": "system", "content": "你是一个有用的AI助手。"},
            {"role": "user", "content": user_message}
        ]

        # 调用大模型 API
        response = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-R1", # 或者 deepseek-chat 等
            messages=messages,
            temperature=0.7
        )

        # 获取 AI 的回复内容
        ai_reply = response.choices[0].message.content

        return jsonify({"success": True, "reply": ai_reply})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)