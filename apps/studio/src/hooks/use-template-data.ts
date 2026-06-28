import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { apiClient } from '../api/client.js';
import type { StudioStatus, StudioTemplateSummary } from '../types.js';

const RENDER_DEBOUNCE_MS = 180;

const buildDefaultValues = (template: StudioTemplateSummary): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const token of template.tokens) out[token.expression] = token.defaultValue;
  return out;
};

export const useTemplateData = () => {
  const [templates, setTemplates] = useState<StudioTemplateSummary[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [valuesByTemplate, setValuesByTemplate] = useState<Record<string, Record<string, string>>>({});
  const [status, setStatus] = useState<StudioStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const renderTokenRef = useRef(0);
  const renderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) ?? null,
    [templates, selectedTemplateId]
  );

  const currentValues = useMemo(
    () => (selectedTemplate ? valuesByTemplate[selectedTemplate.id] ?? buildDefaultValues(selectedTemplate) : {}),
    [selectedTemplate, valuesByTemplate]
  );

  // Load template list once.
  useEffect(() => {
    setStatus('busy');
    apiClient
      .get<StudioTemplateSummary[]>('/api/templates')
      .then((data) => {
        if (!data.length) {
          setErrorMessage('No MJML templates were found in src/pages.');
          setStatus('error');
          return;
        }
        setTemplates(data);
        setSelectedTemplateId(data[0].id);
        setValuesByTemplate(
          Object.fromEntries(data.map((template) => [template.id, buildDefaultValues(template)]))
        );
      })
      .catch((cause: unknown) => {
        setErrorMessage(cause instanceof Error ? cause.message : String(cause));
        setStatus('error');
      });
  }, []);

  const renderNow = useCallback(
    async (template: StudioTemplateSummary, values: Record<string, string>) => {
      const token = ++renderTokenRef.current;
      setStatus('busy');
      try {
        const { html } = await apiClient.post<{ html: string }>('/api/preview', {
          templateId: template.id,
          values
        });
        if (token !== renderTokenRef.current) return;
        setPreviewHtml(html);
        setStatus('success');
      } catch (cause) {
        if (token !== renderTokenRef.current) return;
        setErrorMessage(cause instanceof Error ? cause.message : String(cause));
        setStatus('error');
      }
    },
    []
  );

  const scheduleRender = useCallback(
    (template: StudioTemplateSummary, values: Record<string, string>, immediate = false) => {
      if (renderTimerRef.current) {
        clearTimeout(renderTimerRef.current);
        renderTimerRef.current = null;
      }
      if (immediate) {
        void renderNow(template, values);
        return;
      }
      renderTimerRef.current = setTimeout(() => {
        void renderNow(template, values);
      }, RENDER_DEBOUNCE_MS);
    },
    [renderNow]
  );

  // Re-render when template selection changes (immediate), or values change (debounced).
  useEffect(() => {
    if (!selectedTemplate) return;
    scheduleRender(selectedTemplate, currentValues, true);
    return () => {
      if (renderTimerRef.current) clearTimeout(renderTimerRef.current);
    };
  }, [selectedTemplate, scheduleRender]); // selectedTemplate is by ref; values handled below

  const setVariableValue = useCallback(
    (expression: string, value: string) => {
      if (!selectedTemplate) return;
      setValuesByTemplate((current) => {
        const existing = current[selectedTemplate.id] ?? buildDefaultValues(selectedTemplate);
        const next = { ...existing, [expression]: value };
        scheduleRender(selectedTemplate, next);
        return { ...current, [selectedTemplate.id]: next };
      });
    },
    [selectedTemplate, scheduleRender]
  );

  const sendEmail = useCallback(
    async (to: string) => {
      if (!selectedTemplate) return;
      setStatus('busy');
      try {
        await apiClient.post<{ messageId: string }>('/api/send', {
          templateId: selectedTemplate.id,
          to,
          values: currentValues
        });
        setStatus('success');
      } catch (cause) {
        setErrorMessage(cause instanceof Error ? cause.message : String(cause));
        setStatus('error');
      }
    },
    [selectedTemplate, currentValues]
  );

  return {
    templates,
    selectedTemplate,
    selectedTemplateId,
    selectTemplate: setSelectedTemplateId,
    previewHtml,
    values: currentValues,
    setVariableValue,
    sendEmail,
    status,
    errorMessage
  };
};
