import Head from "next/head";

type Repository = {
  name: string;
  full_name: string;
  description: string;
};

export default function About({ data }: { data: Repository }) {
  return (
    <>
      <Head>
        <title>About Page</title>
      </Head>
      <main>
        <p>
          Wellcome to the testing app for the &nbsp;
          <strong>@ipikuka/next-mdx-remote</strong>
        </p>
        <p>
          FRAMEWORK: <strong>{data.name}</strong>, {data.description}.
        </p>
        <p>
          NODE ENVIRONMENT: <strong>{process.env.NODE_ENV}</strong>
        </p>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const data: Repository = await res.json();

  return { props: { data } };
}
