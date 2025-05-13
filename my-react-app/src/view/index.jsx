import React, { useState, useRef } from 'react'

export default function Index() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // 发送消息
  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', content: input }
    setMessages(msgs => [...msgs, userMsg])
    setInput('')
    setLoading(true)

    // SiliconCloud API
    const apiUrl = 'http://localhost:3001/chat/completions'
    const apiKey = 'sk-svpltoetxutempwhkughwvvhrwgklicgbyauannbzwjcdcit'

    const body = {
      model: "gpt-3.5-turbo", // 你可以根据实际模型名调整
      messages: [...messages, userMsg],
      stream: true
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body)
      })

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      let aiMsg = { role: 'assistant', content: '' }
      setMessages(msgs => [...msgs, aiMsg])

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        // SiliconCloud流式返回格式与OpenAI兼容，按行解析JSON
        const lines = chunk.split('\n').filter(line => line.trim() !== '')
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const dataStr = line.replace('data:', '').trim()
            if (dataStr === '[DONE]') continue
            try {
              const data = JSON.parse(dataStr)
              const delta = data.choices?.[0]?.delta?.content || ''
              aiMsg.content += delta
              setMessages(msgs => {
                const newMsgs = [...msgs]
                newMsgs[newMsgs.length - 1] = { ...aiMsg }
                return newMsgs
              })
              scrollToBottom()
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (err) {
      setMessages(msgs => [...msgs, { role: 'assistant', content: '出错了: ' + err.message }])
    } finally {
      setLoading(false)
      scrollToBottom()
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <div style={{ height: 400, overflowY: 'auto', border: '1px solid #eee', padding: 10, marginBottom: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.role === 'user' ? 'right' : 'left', margin: '8px 0' }}>
            <b>{msg.role === 'user' ? '我' : 'AI'}：</b>
            <span>{msg.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex' }}>
        <input
          style={{ flex: 1, marginRight: 8 }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && handleSend()}
          disabled={loading}
          placeholder="请输入你的问题..."
        />
        <button onClick={handleSend} disabled={loading || !input.trim()}>发送</button>
      </div>
    </div>
  )
}
