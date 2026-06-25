import { useState } from 'react';
import { ErrorBanner } from './components/error-banner.js';
import { PreviewFrame } from './components/preview-frame.js';
import { SendForm } from './components/send-form.js';
import { TemplateList } from './components/template-list.js';
import { VariablePanel } from './components/variable-panel.js';
import { useTemplateData } from './hooks/use-template-data.js';
import type { PreviewMode } from './types.js';

export const App = () => {
  const { templates, selectedTemplateId, setSelectedTemplateId, previewHtml, values, setValues, sendEmail, sendResult, error } = useTemplateData();
  const [mode, setMode] = useState<PreviewMode>('desktop');

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <h1>Email Template Studio</h1>
          <p>Build reusable MJML emails. Preview desktop and phone. Send safe test messages.</p>
        </div>
        <div className="toolbar">
          <button type="button" onClick={() => setMode('desktop')}>Desktop</button>
          <button type="button" onClick={() => setMode('phone')}>Phone</button>
        </div>
      </header>
      <ErrorBanner message={error} />
      <section className="layout-grid">
        <TemplateList templates={templates} selectedTemplateId={selectedTemplateId} onSelect={setSelectedTemplateId} />
        <section className="preview-panel panel">
          <h2>Preview</h2>
          <PreviewFrame html={previewHtml} mode={mode} />
        </section>
        <VariablePanel values={values} onChange={(key, value) => setValues((current) => ({ ...current, [key]: value }))} />
        <SendForm onSend={sendEmail} result={sendResult} />
      </section>
    </main>
  );
};
