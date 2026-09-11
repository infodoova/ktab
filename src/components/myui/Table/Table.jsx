import React from "react";
import "./Table.css";

/**
 * Custom Zero-Dependency Table Primitives
 */
export function Table({ className = "", children, ...props }) {
  return (
    <div className="ktab-table-container" dir="rtl">
      <table className={`ktab-table ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className = "", children, ...props }) {
  return (
    <thead className={`ktab-table-header ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className = "", children, ...props }) {
  return (
    <tbody className={`ktab-table-body ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ className = "", children, ...props }) {
  return (
    <tr className={`ktab-table-row ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ className = "", children, ...props }) {
  return (
    <th className={`ktab-table-head ${className}`} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ className = "", children, ...props }) {
  return (
    <td className={`ktab-table-cell ${className}`} {...props}>
      {children}
    </td>
  );
}

export default Table;
