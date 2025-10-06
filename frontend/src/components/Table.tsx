import { ReactNode } from 'react';
import './Table.css';

interface TableProps {
  columns: string[];
  rows: ReactNode[][];
}

const Table = ({ columns, rows }: TableProps) => (
  <div className="table-wrapper">
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            {row.map((cell, cIdx) => (
              <td key={cIdx}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Table;
