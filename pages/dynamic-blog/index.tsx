import Link from "next/link";
import Head from "next/head";
import { type GetStaticProps } from "next/types";

import { type FrontmatterWithSlug } from "@/types";
import { getFrontmatterAndSlug, getMarkdownFiles } from "@/utils/file";

export default function DynamicBlog({
  posts,
}: {
  posts: FrontmatterWithSlug[];
}) {
  return (
    <>
      <Head>
        <title>Dynamic Blog</title>
      </Head>
      <div>
        <strong>Wellcome to dynamic blog</strong>
        <ul>
          {posts.map((post) => (
            <li key={post.title}>
              👉 <Link href={`/dynamic-blog/${post.slug}`}>{post.title}</Link>{" "}
              <span>(Author: {post.author})</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = () => {
  const files = getMarkdownFiles();

  const filteredFiles = files.filter(
    (f) => !f.includes("esm") && !f.includes("error")
  );

  const frontmatters = filteredFiles.map(getFrontmatterAndSlug);

  return {
    props: {
      posts: frontmatters,
    },
  };
};
