export default function DataTable({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {columns.map(col => (
              <th key={col.key} className="px-4 py-3 text-left text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest bg-white/[0.02]">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-text-muted font-mono text-xs">No data</td></tr>
          )}
          {data.map((row, i) => (
            <tr
              key={row._id || i}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-white/[0.04] transition-colors ${
                onRowClick ? 'cursor-pointer hover:bg-primary/[0.06]' : ''
              } ${i % 2 === 1 ? 'bg-white/[0.01]' : ''}`}
            >
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-text-secondary">
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
