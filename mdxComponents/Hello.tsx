export default function Hello({ name }: { name: string }) {
  return (
    <p className="hello-content" style={{ color: "blue" }}>
      Hello {name}
    </p>
  );
}
