import Link from "next/link";
import { type Metadata } from "next";

import { getFrontmatterAndSlug, getMarkdownFiles } from "@/utils/file";

export const metadata: Metadata = {
  title: "Dynamic Docs",
};

export default async function Docs() {
  const files = getMarkdownFiles();

  const filteredFiles = files.filter(
    (f) => !f.includes("context") && !f.includes("error")
  );

  const frontmatters = filteredFiles.map(getFrontmatterAndSlug);

  return (
    <div>
      <strong>Wellcome to dynamic docs</strong>
      <ul>
        {frontmatters.map((frontmatter) => (
          <li key={frontmatter?.title}>
            👉{" "}
            <Link href={`/dynamic-docs/${frontmatter?.slug}`}>
              {frontmatter?.title}
            </Link>{" "}
            <span>(Author: {frontmatter?.author})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
