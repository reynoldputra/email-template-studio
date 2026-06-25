import { useEffect, useState } from 'react';
import { apiClient } from '../api/client.js';
import type { StudioTemplateListItem } from '../types.js';

export const useTemplateData = () => {
  const [templates, setTemplates] = useState<StudioTemplateListItem[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [sendResult, setSendResult] = useState('');

  useEffect(() => {
    apiClient
      .get<StudioTemplateListItem[]>('/api/templates')
      .then((data) => {
        setTemplates(data);
        if (data[0]) setSelectedTemplateId(data[0].id);
      })
      .catch((cause) => setError(String(cause)));
  }, []);

  useEffect(() => {
    if (!selectedTemplateId) return;
    apiClient
      .post<{ html: string }>('/api/preview', { templateId: selectedTemplateId, values })
      .then((data) => setPreviewHtml(data.html))
      .catch((cause) => setError(String(cause)));
  }, [selectedTemplateId, values]);

  const sendEmail = async (to: string) => {
    const result = await apiClient.post<{ messageId: string }>('/api/send', {
      templateId: selectedTemplateId,
      to,
      values
    });
    setSendResult(result.messageId);
  };

  return {
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    previewHtml,
    values,
    setValues,
    sendEmail,
    sendResult,
    error
  };
};
