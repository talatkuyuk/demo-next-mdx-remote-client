import { type PluggableList } from "unified";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import remarkFlexibleMarkers from "remark-flexible-markers";
import remarkFlexibleParagraphs from "remark-flexible-paragraphs";
import remarkFlexibleCodeTitles from "remark-flexible-code-titles";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import recmaMdxEscapeMissingComponents from "recma-escape-missing-components";
import remarkFlexibleToc, { type TocItem } from "./plugin";
import recmaMdxChangeProps from "./plugin2";

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
