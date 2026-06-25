import type { StudioTemplateListItem } from '../types.js';

export const TemplateList = ({
  templates,
  selectedTemplateId,
  onSelect
}: {
  templates: StudioTemplateListItem[];
  selectedTemplateId: string;
  onSelect: (id: string) => void;
}) => (
  <aside className="panel">
    <h2>Templates</h2>
    <ul className="template-list">
      {templates.map((template) => (
        <li key={template.id}>
          <button
            type="button"
            className={selectedTemplateId === template.id ? 'active' : ''}
            aria-pressed={selectedTemplateId === template.id}
            onClick={() => onSelect(template.id)}
          >
            {template.name}
          </button>
        </li>
      ))}
    </ul>
  </aside>
);
