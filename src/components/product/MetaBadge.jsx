import { useTranslation } from 'react-i18next';

const CONDITION_COLORS = {
  good: 'bg-green-100 text-green-800',
  ok:   'bg-lime-100 text-lime-800',
  used: 'bg-amber-100 text-amber-800',
};

const STATUS_COLORS = {
  available: 'bg-green-100 text-green-800',
  limited:   'bg-orange-100 text-orange-800',
  sold:      'bg-gray-100 text-gray-800',
};

const STATUS_DOT = {
  available: 'bg-green-500',
  limited:   'bg-orange-500',
  sold:      'bg-gray-500',
};

/**
 * MetaBadge — renders a condition or status badge with a colored dot.
 *
 * @param {{ type: 'condition'|'status', value: string }} props
 */
export function MetaBadge({ type, value }) {
  const { t } = useTranslation();
  if (!value) return null;

  const colorClass = type === 'condition' ? CONDITION_COLORS[value] : STATUS_COLORS[value];
  const label = t(`product.${type}_${value}`);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colorClass || ''}`}>
      {type === 'status' && (
        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[value] || 'bg-transparent'}`} aria-hidden="true" />
      )}
      {label}
    </span>
  );
}

/**
 * MetaGrid — renders a grid of labelled meta fields for a product.
 *
 * @param {{ items: Array<{ label: string, value: React.ReactNode }> }} props
 */
export function MetaGrid({ items = [] }) {
  const filtered = items.filter((i) => i.value !== null && i.value !== undefined && i.value !== '');
  if (!filtered.length) return null;

  return (
    <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100 my-2">
      {filtered.map(({ label, value, badge }) => (
        <div className="flex flex-col gap-1" key={label}>
          <span className="text-xs uppercase font-bold text-gray-500">{label}</span>
          {badge ? (
            <div className="mt-1">{badge}</div>
          ) : (
            <span className="text-sm font-medium text-gray-900">{value}</span>
          )}
        </div>
      ))}
    </div>
  );
}
