import { type Metadata } from "next";

type Repository = {
  name: string;
  full_name: string;
  description: string;
};

export const metadata: Metadata = {
  title: "Main Page",
};

export default async function Home() {
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const data: Repository = await res.json();

  return (
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
  );
}
