'use client';

import { useEffect, useState } from 'react';
import styles from './chat.module.css';

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('../api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from API');
      }

      const data = await response.json();
      const assistantMessage =
        data?.choices?.[0]?.message?.content || 'Antwort konnte nicht abgerufen werden.';

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: assistantMessage },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: 'Error: Unable to get response. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Löschen .env File beim Schließen der Seite
  useEffect(() => {
    const deleteEnvFile = async () => {
      try {
        await fetch('/api/deleteEnvFile', { method: 'POST' });
      } catch (err) {
        console.error('Failed to delete .env file:', err);
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      deleteEnvFile();
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      deleteEnvFile();
    };
  }, []);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.length === 0 && !loading && (
          <div className={styles.placeholder}>
          </div>
        )}
        {messages.map((message, i) => (
          <div
            key={i}
            className={`${styles.messageWrapper} ${
              message.role === 'user' ? styles.userMessage : styles.assistantMessage
            }`}
          >
            <div className={styles.messageBubble}>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className={styles.messageWrapper}>
            <div className={styles.messageBubble}>
              <p>Loading...</p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send your message..."
            className={styles.input}
            disabled={loading}
          />
          <button type="submit" className={styles.sendButton} disabled={loading}>
            ➜
          </button>
        </div>
      </form>
    </div>
  );
}
