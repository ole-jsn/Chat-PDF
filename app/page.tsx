"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import './page.css';

export default function Home() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!file?.name.endsWith('.pdf')) {
      setError('Please select a valid PDF File.');
      return;
    }

    if (!apiKey.startsWith('sk')) {
      setError('Invalid API Key. It should start with "sk".');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('apiKey', apiKey);

    try {
      const keyResponse = await fetch('/api/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });

      if (keyResponse.ok) {
        try {
          const fileResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (fileResponse.ok) {
            router.push('/chat');
          } else {
            setError('Failed to upload the file.');
          }
        } catch {
          setError('An error occurred while uploading the file.');
        }
      } else {
        setError('Failed to validate the API key.');
      }
    } catch {
      setError('An error occurred during the API key validation process.');
    }
  };

  return (
    <div className="container">
      <h1 className="title">Upload Your PDF</h1>
      <form className="container__form" onSubmit={handleUpload}>
        {error && <div className="error-message">{error}</div>}
        <input
          type="file"
          id="file"
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        />
        <label htmlFor="file" className="container__button">
          <span>📄</span> {file ? 'Change PDF' : 'Select PDF'}
        </label>
        <input
          type="text"
          className="api-key-input"
          placeholder="Enter your OpenAI API-Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        {file && apiKey && (
          <button type="submit" className="container__button continue-button">
            Proceed to Chat
          </button>
        )}
      </form>
    </div>
  );
}
