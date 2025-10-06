import type { ReactNode } from 'react';
import './DataTable.css';

interface Column<T> {
  header: string;
  accessor: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export function DataTable<T>({ data, columns }: DataTableProps<T>) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.header}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.header}>{column.accessor(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
