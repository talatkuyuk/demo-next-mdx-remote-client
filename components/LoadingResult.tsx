export default function LoadingResult() {
  return (
    <table className="result" style={{ minHeight: "95vh" }}>
      <thead>
        <tr>
          <td>
            <mark>
              with using <strong>evaluate</strong>
            </mark>
          </td>
          <td>
            <mark>
              with using <strong>MDXRemote</strong>
            </mark>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <p>Loading the article...</p>
          </td>
          <td>
            <p>Loading the article...</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
