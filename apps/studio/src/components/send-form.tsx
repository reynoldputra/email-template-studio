import { useState } from 'react';

export const SendForm = ({ onSend, result }: { onSend: (to: string) => Promise<void>; result: string }) => {
  const [to, setTo] = useState('');
  return (
    <form
      className="panel"
      onSubmit={(event) => {
        event.preventDefault();
        void onSend(to);
      }}
    >
      <h2>Send Test Email</h2>
      <label>
        Recipient
        <input type="email" name="to" placeholder="name@example.com" value={to} onChange={(event) => setTo(event.currentTarget.value)} />
      </label>
      <button type="submit">Send email</button>
      {result ? <p>{result}</p> : null}
    </form>
  );
};
