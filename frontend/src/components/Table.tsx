import { ReactNode } from 'react';

interface TableProps {
  headers: string[];
  rows: ReactNode[][];
}

export const Table = ({ headers, rows }: TableProps) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead className="bg-slate-50">
        <tr>
          {headers.map((header) => (
            <th key={header} scope="col" className="px-4 py-2 text-left font-semibold text-slate-600">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white">
        {rows.map((row, idx) => (
          <tr key={idx} className="hover:bg-slate-50">
            {row.map((cell, cIdx) => (
              <td key={cIdx} className="px-4 py-2 text-slate-700">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
