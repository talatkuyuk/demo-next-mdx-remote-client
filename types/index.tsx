export type Frontmatter = {
  title: string;
  author: string;
  disableExports: boolean;
  disableImports: boolean;
};

export type FrontmatterWithSlug = Frontmatter & {
  slug: string;
};
