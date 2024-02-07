import { type Plugin } from "unified";
import { type Root } from "mdast";
import { visit, CONTINUE } from "unist-util-visit";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";

export type TocItem = {
  value: string;
  url: string;
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  numbering: number[];
  parent:
    | "root"
    | "blockquote"
    | "footnoteDefinition"
    | "listItem"
    | "mdxJsxFlowElement";
  data?: Record<string, unknown>;
};

export type FlexibleTocOptions = {
  tocName?: string;
  tocRef?: TocItem[];
  levels?: number[];
  prefix?: string;
  fallback?: (toc: TocItem[]) => undefined;
};

const DEFAULT_SETTINGS: FlexibleTocOptions = {
  tocName: "toc",
  tocRef: [],
  levels: [2, 3, 4, 5, 6], // level-1 is excluded by default since the article h1 is not expected to be in the Toc
};

/**
 * adds numberings to the TOC items.
 * why "number[]"? It is because up to you joining with dot or dash or slicing the first number (reserved for h1)
 *
 * [1]
 * [1,1]
 * [1,2]
 * [1,2,1]
 */
function addNumbering(arr: TocItem[]) {
  for (let i = 0; i < arr.length; i++) {
    const tocItem = arr[i];
    const depth = tocItem.depth;

    let numbering: number[] = [];

    const prevObj = i > 0 ? arr[i - 1] : undefined;
    const prevLevel = prevObj ? prevObj.numbering : undefined;
    const prevDepth = prevObj ? prevObj.depth : undefined;

    if (!prevLevel || prevDepth === undefined) {
      numbering = Array.from({ length: depth }, () => 1);
    } else if (depth === prevDepth) {
      numbering = [...prevLevel];
      numbering[depth - 1]++;
    } else if (depth > prevDepth) {
      numbering = [...prevLevel, 1];
    } else if (depth < prevDepth) {
      numbering = prevLevel.slice(0, depth);
      numbering[depth - 1]++;
    }

    tocItem.numbering = numbering;
  }
}

const RemarkFlexibleToc: Plugin<[FlexibleTocOptions?], Root> = (options) => {
  const settings = Object.assign({}, DEFAULT_SETTINGS, options);

  return (tree, file) => {
    const slugger = new GithubSlugger();
    const tocItems: TocItem[] = [];

    visit(tree, "heading", (_node, _index, _parent) => {
      if (!_index || !_parent) return;

      if (!settings.levels!.includes(_node.depth)) return CONTINUE;

      const depth = _node.depth;
      const value = toString(_node, { includeImageAlt: false });
      const url = `#${settings.prefix ?? ""}${slugger.slug(value)}`;
      const parent = _parent.type;

      // Other remark plugins can store custom data in node.data.hProperties
      // I excluded node.data.hName and node.data.hChildren since not related with toc
      const data = _node.data?.hProperties
        ? { ..._node.data.hProperties }
        : undefined;

      tocItems.push({
        value,
        url,
        depth,
        numbering: [],
        parent,
        ...(data && { data }),
      });
    });

    addNumbering(tocItems);

    // method - 1 for exposing the data
    file.data[settings.tocName!] = tocItems;

    // method - 2 for exposing the data
    if (options?.tocRef) {
      tocItems.forEach((tocItem) => {
        settings.tocRef?.push(tocItem);
      });
    }

    settings.fallback?.(tocItems);
  };
};

export default RemarkFlexibleToc;
