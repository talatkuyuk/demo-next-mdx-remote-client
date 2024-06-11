import { type Metadata } from "next";

type Repository = {
  name: string;
};

export const metadata: Metadata = {
  title: "Ipikuka Blog Main Page",
};

export default async function Home() {
  // for demo purpose
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const data: Repository = await res.json();

  return (
    <main>
      <h4 style={{ marginBottom: "0.5rem" }}>
        Demo for &nbsp;
        <a
          href="https://www.npmjs.com/package/next-mdx-remote-client"
          target="_blank"
        >
          next-mdx-remote-client
        </a>
      </h4>
      <div className="card">
        <p>
          <span>FRAMEWORK</span>
          <strong>{data.name}</strong>
        </p>
        <p>
          <span>ENVIRONMENT</span>
          <strong>{process.env.NODE_ENV}</strong>
        </p>
      </div>
      <p style={{ marginTop: "0.5rem" }}>
        Visit for &nbsp;
        <a
          href="https://github.com/talatkuyuk/demo-next-mdx-remote-client"
          target="_blank"
        >
          source code in github
        </a>
      </p>
    </main>
  );
}
