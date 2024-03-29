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
import remarkFlexibleToc, {
  type FlexibleTocOptions,
  type TocItem,
} from "remark-flexible-toc";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import recmaMdxEscapeMissingComponents from "recma-mdx-escape-missing-components";
import recmaMdxChangeProps from "recma-mdx-change-props";

import { toTitleCase } from ".";
import { code, html } from "./rehype-handlers";

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
  [
    recmaMdxEscapeMissingComponents,
    ["Bar", "Toc", "ComponentFromOuterProvider"],
  ],
  recmaMdxChangeProps,
];

export function getRemarkRehypeOptions(format: "md" | "mdx") {
  return { handlers: { ...(format === "md" && { html }), code } };
}
