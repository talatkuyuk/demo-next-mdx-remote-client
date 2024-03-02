import Head from "next/head";

type Repository = {
  name: string;
};

export default function About({ data }: { data: Repository }) {
  return (
    <>
      <Head>
        <title>About Page</title>
      </Head>
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
      </main>
    </>
  );
}

export async function getStaticProps() {
  // for demo purpose
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const data: Repository = await res.json();

  return { props: { data } };
}
