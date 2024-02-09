export type Frontmatter = {
  title: string;
  author: string;
  disableExports: boolean;
  enableImports: boolean;
};

export type FrontmatterWithSlug = Frontmatter & {
  slug: string;
};
