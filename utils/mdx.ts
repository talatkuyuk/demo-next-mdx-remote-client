import { type PluggableList } from "unified";
import { nodeTypes } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import remarkFlexibleMarkers from "remark-flexible-markers";
import remarkFlexibleCodeTitles from "remark-flexible-code-titles";
import remarkFlexibleContainers, {
  type FlexibleContainerOptions,
} from "remark-flexible-containers";
import remarkFlexibleParagraphs from "remark-flexible-paragraphs";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import recmaMdxEscapeMissingComponents from "recma-mdx-escape-missing-components";
import recmaMdxChangeProps from "recma-mdx-change-props";

import remarkFlexibleToc, { FlexibleTocOptions, type TocItem } from "./plugin";
import { toTitleCase } from ".";

const baseRemarkPlugins: PluggableList = [
  remarkGfm,
  remarkFlexibleMarkers, // order of plugins matters
  remarkEmoji,
  remarkFlexibleParagraphs,
  [
    remarkFlexibleContainers,
    {
      title: () => null,
      containerTagName: "admonition",
      containerProperties: (type, title) => {
        return {
          ["data-type"]: type?.toLowerCase(),
          ["data-title"]: toTitleCase(title) ?? toTitleCase(type),
        };
      },
    } as FlexibleContainerOptions,
  ],
  remarkFlexibleCodeTitles,
];

export const remarkPlugins: PluggableList = [
  ...baseRemarkPlugins,
  remarkFlexibleToc,
];

// experimental, used in only "Test Basic" pages to get the Table of Contents differently
export function getRemarkPlugins(toc: TocItem[]): PluggableList {
  return [
    ...baseRemarkPlugins,
    [
      remarkFlexibleToc,
      {
        tocRef: toc, // the plugin "remark-flexible-toc" mutates the "toc" via "tocRef"
      } as FlexibleTocOptions,
    ],
  ];
}

export const rehypePlugins: PluggableList = [
  [rehypeRaw, { passThrough: nodeTypes }], // to allow HTML elements in "md" format, "passThrough" is for "mdx" works as well
  rehypeHighlight,
  rehypeSlug,
];

export const recmaPlugins: PluggableList = [
  [recmaMdxEscapeMissingComponents, ["Bar", "Toc"]],
  recmaMdxChangeProps,
];
