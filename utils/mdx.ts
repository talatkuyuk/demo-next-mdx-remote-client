import { type PluggableList } from "unified";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import remarkFlexibleMarkers from "remark-flexible-markers";
import remarkFlexibleParagraphs from "remark-flexible-paragraphs";
import remarkFlexibleCodeTitles from "remark-flexible-code-titles";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import recmaMdxEscapeMissingComponents from "recma-mdx-escape-missing-components";
import recmaMdxChangeProps from "recma-mdx-change-props";

import remarkFlexibleToc, { type TocItem } from "./plugin";

export const remarkPlugins: PluggableList = [
  remarkGfm,
  remarkFlexibleMarkers, // order of plugins matters
  remarkEmoji,
  remarkFlexibleParagraphs,
  remarkFlexibleCodeTitles,
  remarkFlexibleToc,
];

export const rehypePlugins: PluggableList = [rehypeHighlight, rehypeSlug];

export const recmaPlugins: PluggableList = [
  [recmaMdxEscapeMissingComponents, ["Bar", "Toc"]],
  recmaMdxChangeProps,
];

// experimental, used in only "Test Basic" pages to get the Table of Contents differently
export function getRemarkPlugins(toc: TocItem[]): PluggableList {
  return [
    remarkGfm,
    remarkFlexibleMarkers, // order of plugins matters
    remarkEmoji,
    remarkFlexibleParagraphs,
    remarkFlexibleCodeTitles,
    [remarkFlexibleToc, { tocRef: toc }], // the plugin mutates the "toc" via "tocRef"
  ];
}
