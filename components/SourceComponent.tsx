type Props = {
  source: string;
};

export default function SourceComponent({ source }: Props) {
  return (
    <div id="mdx-source">
      <pre>
        <code>{source}</code>
      </pre>
    </div>
  );
}
