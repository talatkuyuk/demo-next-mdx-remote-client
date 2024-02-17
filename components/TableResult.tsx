import React from "react";

type Props = {
  leftColumnHeader: string;
  rightColumnHeader: string;
  children: [React.ReactNode, React.ReactNode];
};

const TableResult = ({
  leftColumnHeader,
  rightColumnHeader,
  children,
}: Props) => {
  return (
    <table className="result">
      <thead>
        <tr>
          <td>
            <mark>
              with using <strong>{leftColumnHeader}</strong>
            </mark>
          </td>
          <td>
            <mark>
              with using <strong>{rightColumnHeader}</strong>
            </mark>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{children[0]}</td>
          <td>{children[1]}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TableResult;
