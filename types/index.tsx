export type Frontmatter = {
  title: string;
  author: string;
  enableImports: boolean;
};

export type FrontmatterWithSlug = Frontmatter & {
  slug: string;
};
