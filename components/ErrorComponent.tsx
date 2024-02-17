type Props = {
  error: Error | string;
};

export default function ErrorComponent({ error }: Props) {
  return (
    <div id="mdx-error">
      <pre style={{ color: "red" }}>
        <code>{typeof error === "string" ? error : error.message}</code>
      </pre>
    </div>
  );
}
