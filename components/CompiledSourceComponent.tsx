type Props = {
  compiledSource: string;
  full?: boolean;
};

export default function CompiledSourceComponent({
  compiledSource,
  full,
}: Props) {
  const firstPartIndex = compiledSource.indexOf("function _createMdxContent");
  const lastPartIndex = compiledSource.indexOf("function MDXContent");

  return (
    <div id="mdx-compiled-source">
      <pre>
        <code>
          {full ? (
            compiledSource
          ) : (
            <>
              {compiledSource.substring(0, firstPartIndex - 1)}
              <span style={{ color: "darkgray" }}>
                {"\n\n.........\n.........\n\n"}
              </span>
              {compiledSource.slice(lastPartIndex - compiledSource.length)}
            </>
          )}
        </code>
      </pre>
    </div>
  );
}
