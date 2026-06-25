export const VariablePanel = ({
  values,
  onChange
}: {
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) => (
  <section className="panel">
    <h2>Variables</h2>
    <label>
      First Name
      <input value={values.first_name ?? ''} onChange={(event) => onChange('first_name', event.currentTarget.value)} />
    </label>
  </section>
);
