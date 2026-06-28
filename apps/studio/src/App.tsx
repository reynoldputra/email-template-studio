import { useCallback, useRef, useState } from 'react';
import { useTemplateData } from './hooks/use-template-data.js';
import type { PreviewMode, StudioStatus } from './types.js';

const STATUS_LABEL: Record<StudioStatus, string> = {
  idle: 'Idle',
  busy: 'Working',
  success: 'Done',
  error: 'Error'
};

const STATUS_CLASS: Record<StudioStatus, string> = {
  idle: 'status-dot',
  busy: 'status-dot is-busy',
  success: 'status-dot is-success',
  error: 'status-dot is-error'
};

export const App = () => {
  const {
    templates,
    selectedTemplate,
    selectedTemplateId,
    selectTemplate,
    previewHtml,
    values,
    setVariableValue,
    sendEmail,
    status,
    errorMessage
  } = useTemplateData();

  const [mode, setMode] = useState<PreviewMode>('mobile');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sending, setSending] = useState(false);
  const recipientRef = useRef<HTMLInputElement>(null);
  const previewFrameRef = useRef<HTMLIFrameElement>(null);

  const handleSend = useCallback(async () => {
    const to = recipientRef.current?.value.trim();
    if (!to) {
      recipientRef.current?.focus();
      return;
    }
    setSending(true);
    await sendEmail(to);
    setSending(false);
  }, [sendEmail]);

  const templateName = selectedTemplate?.name ?? 'Loading templates…';
  const templatePreview = selectedTemplate?.preview || 'No preview copy was declared in the MJML head.';
  const tokenCount = selectedTemplate?.tokens.length ?? 0;
  const fileName = selectedTemplate ? `${selectedTemplate.id}.mjml` : 'No template selected';

  return (
    <>
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />

      <div className={`app-shell${sidebarOpen ? '' : ' is-sidebar-collapsed'}`}>
        {/* Sidebar */}
        <aside className="sidebar" aria-label="Template variables panel">
          <div className="sidebar__header">
            <div>
              <p className="eyebrow">Template variables</p>
              <h2 className="sidebar__title">{templateName}</h2>
            </div>
            <button className="icon-button" type="button" onClick={() => setSidebarOpen(false)}>
              Hide
            </button>
          </div>

          <p className="sidebar__preview">{templatePreview}</p>

          <div className="sidebar__meta">
            <span className="meta-chip">
              {tokenCount} variable{tokenCount === 1 ? '' : 's'}
            </span>
            <span className="meta-chip meta-chip--muted">{fileName}</span>
          </div>

          <div className="fields" aria-live="polite">
            {selectedTemplate && tokenCount === 0 && (
              <div className="field">
                <p className="field__label">No variables detected</p>
                <p className="field__hint">This template is ready to render as-is.</p>
              </div>
            )}
            {selectedTemplate?.tokens.map((token) => (
              <div key={token.expression} className="field">
                <div className="field__top">
                  <p className="field__label">{token.label}</p>
                  <p className="field__expression">{token.expression}</p>
                </div>
                {token.inputType === 'text' && (values[token.expression] ?? token.defaultValue ?? '').includes('\n') ? (
                  <textarea
                    className="field__input"
                    value={values[token.expression] ?? token.defaultValue ?? ''}
                    placeholder={token.defaultValue || token.label}
                    onChange={(event) => setVariableValue(token.expression, event.currentTarget.value)}
                  />
                ) : (
                  <input
                    className="field__input"
                    type={token.inputType}
                    value={values[token.expression] ?? token.defaultValue ?? ''}
                    placeholder={token.defaultValue || token.label}
                    onChange={(event) => setVariableValue(token.expression, event.currentTarget.value)}
                  />
                )}
                <p className="field__hint">
                  {token.inputType === 'url'
                    ? 'Rendered as a link'
                    : token.inputType === 'email'
                      ? 'Rendered as an email address'
                      : 'Live variable'}
                </p>
              </div>
            ))}
          </div>
        </aside>

        {/* Workspace */}
        <section className="workspace">
          <header className="toolbar">
            <div className="toolbar__brand">
              <p className="eyebrow">Email Template Studio</p>
              <h1>Preview, personalize, and send from one place.</h1>
            </div>

            <div className="toolbar__controls">
              <button
                className="chip-button"
                type="button"
                aria-expanded={sidebarOpen}
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                Sidebar
              </button>

              <label className="control control--template">
                <span>Template</span>
                <select value={selectedTemplateId} onChange={(event) => selectTemplate(event.currentTarget.value)}>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="segmented" role="tablist" aria-label="Preview mode">
                <button
                  className={`segmented__button${mode === 'mobile' ? ' is-active' : ''}`}
                  type="button"
                  onClick={() => setMode('mobile')}
                >
                  Mobile
                </button>
                <button
                  className={`segmented__button${mode === 'desktop' ? ' is-active' : ''}`}
                  type="button"
                  onClick={() => setMode('desktop')}
                >
                  Desktop
                </button>
              </div>

              <label className="control control--recipient">
                <span>Send to</span>
                <input ref={recipientRef} type="email" placeholder="recipient@example.com" autoComplete="email" />
              </label>

              <button className="send-button" type="button" disabled={sending} onClick={handleSend}>
                {sending ? 'Sending…' : 'Send email'}
              </button>
            </div>
          </header>

          <main className="preview-stage" data-mode={mode}>
            <div className="preview-shell">
              <div className="preview-shell__header">
                <div>
                  <p className="eyebrow">Live preview</p>
                  <p className="preview-shell__meta">
                    {selectedTemplate
                      ? `${selectedTemplate.name} · ${mode} preview`
                      : 'Waiting for the first render.'}
                  </p>
                </div>
                <span className={STATUS_CLASS[status]}>{STATUS_LABEL[status]}</span>
              </div>

              <div className="preview-frame-shell">
                <iframe ref={previewFrameRef} title="Rendered email preview" srcDoc={previewHtml} />
              </div>
            </div>
          </main>
        </section>
      </div>

      {status === 'error' && errorMessage && (
        <div role="alert" style={{ display: 'none' }}>
          {errorMessage}
        </div>
      )}
    </>
  );
};
