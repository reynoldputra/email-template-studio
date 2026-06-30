import { useCallback, useRef, useState } from 'react';
import { useTemplateData } from './hooks/use-template-data.js';
import type { PreviewMode, StudioStatus } from './types.js';

const STATUS_LABEL: Record<StudioStatus, string> = {
  idle: 'Idle',
  busy: 'Working',
  success: 'Done',
  error: 'Error',
};

const STATUS_CLASS: Record<StudioStatus, string> = {
  idle: 'status-dot',
  busy: 'status-dot is-busy',
  success: 'status-dot is-success',
  error: 'status-dot is-error',
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
    errorMessage,
  } = useTemplateData();

  const [mode, setMode] = useState<PreviewMode>('mobile');
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
  const tokenCount = selectedTemplate?.tokens.length ?? 0;
  const fileName = selectedTemplate ? `${selectedTemplate.id}.mjml` : 'No template selected';

  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar" aria-label="Template variables panel">
        <div className="sidebar__header">
          <p className="sidebar__eyebrow">Variables</p>
          <span className="sidebar__count">{tokenCount}</span>
        </div>

        <div className="fields" aria-live="polite">
          {selectedTemplate && tokenCount === 0 && (
            <div className="field field--empty">
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
              {token.inputType === 'text' &&
              (values[token.expression] ?? token.defaultValue ?? '').includes('\n') ? (
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

      {/* ── Main workspace ── */}
      <section className="workspace">
        {/* ── Top bar ── */}
        <header className="topbar">
          <div className="topbar__brand">
            <p className="topbar__logo">Email Template Studio</p>
            <span className="pipeline-badge">
              <span className={`pipeline-badge__dot${status === 'busy' ? ' is-rendering' : ''}`} />
              MJML <span className="pipeline-badge__arrow">&rarr;</span> HTML
            </span>
          </div>

          <div className="topbar__controls">
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

            <span className={STATUS_CLASS[status]}>{STATUS_LABEL[status]}</span>
          </div>
        </header>

        {/* ── Template picker ── */}
        <div className="picker">
          <label className="picker__label">Template</label>
          <select value={selectedTemplateId} onChange={(event) => selectTemplate(event.currentTarget.value)}>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <span className="picker__file">{fileName}</span>
          <span className="picker__desc">{selectedTemplate?.name ?? ''}</span>
        </div>

        {/* ── Preview ── */}
        <main className="preview-stage" data-mode={mode}>
          <div className="preview-shell">
            <div className="preview-frame-shell">
              <iframe ref={previewFrameRef} title="Rendered email preview" srcDoc={previewHtml} />
            </div>
          </div>
        </main>

        {/* ── Send bar ── */}
        <div className="send-bar">
          <label className="send-bar__field">
            <span>Send to</span>
            <input ref={recipientRef} type="email" placeholder="recipient@example.com" autoComplete="email" />
          </label>
          <button className="send-button" type="button" disabled={sending} onClick={handleSend}>
            {sending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </section>

      {status === 'error' && errorMessage && (
        <div role="alert" style={{ display: 'none' }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};
