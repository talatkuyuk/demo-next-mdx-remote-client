import fs from "fs";
import path from "path";
import { getFrontmatter } from "next-mdx-remote-client/utils";

import { Frontmatter, FrontmatterWithSlug } from "@/types";

export const RE = /\.mdx?$/u; // Only .md(x) files

export const getSource = async (filename: string): Promise<string> => {
  const sourcePath = path.join(process.cwd(), "data", filename);
  if (!fs.existsSync(sourcePath)) return "No file founded !";
  return await fs.promises.readFile(sourcePath, "utf8");
};

export const getSourceSync = (filename: string): string => {
  const sourcePath = path.join(process.cwd(), "data", filename);
  if (!fs.existsSync(sourcePath)) return "No file founded !";
  return fs.readFileSync(sourcePath, "utf8");
};

export const getMarkdownFiles = (): string[] => {
  return fs
    .readdirSync(path.join(process.cwd(), "data"))
    .filter((filePath: string) => RE.test(filePath));
};

export const getMarkdownFile = async (
  slug: string
): Promise<
  | {
      source: string;
      format: "md" | "mdx";
      frontmatter: Frontmatter;
    }
  | undefined
> => {
  const mdxFullPath = path.join(process.cwd(), "data", `${slug}.mdx`);
  const mdFullPath = path.join(process.cwd(), "data", `${slug}.md`);

  // mdx takes precedence
  if (fs.existsSync(mdxFullPath)) {
    const source = await getSource(`${slug}.mdx`);
    const frontmatter = getFrontmatter<Frontmatter>(source).frontmatter;

    return { source, format: "mdx", frontmatter };
  }

  if (fs.existsSync(mdFullPath)) {
    const source = await getSource(`${slug}.md`);
    const frontmatter = getFrontmatter<Frontmatter>(source).frontmatter;

    return { source, format: "md", frontmatter };
  }
};

export const getFrontmatterAndSlug = (
  filename: string
): FrontmatterWithSlug => {
  const source = getSourceSync(filename);

  const frontmatter = getFrontmatter<Frontmatter>(source).frontmatter;

  const frontmatterWithSlug: FrontmatterWithSlug = {
    ...frontmatter,
    slug: filename.replace(RE, ""),
  };

  return frontmatterWithSlug;
};
