import { type Plugin } from "unified";
import { type Root } from "mdast";
import { visit, CONTINUE } from "unist-util-visit";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";

export type FlexibleTocOptions = {
  tocName?: string;
  tocRef?: TocItem[];
  levels?: number[];
};

export type TocItem = {
  value: string;
  url: string;
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  numbering: number[];
  parent?:
    | "root"
    | "blockquote"
    | "footnoteDefinition"
    | "listItem"
    | "mdxJsxFlowElement";
};

const DEFAULT_SETTINGS: FlexibleTocOptions = {
  tocName: "toc",
  tocRef: [],
  levels: [2, 3, 4, 5, 6],
  // level-1 is excluded by default in "levels" since the article h1 heading wouldn't be in the Toc in general
};

/**
 * adds numberings to TOC items by mutating
 * why "number[]"? It is because up to you joining with dot or dash or slicing the first number (reserved for h1)
 *
 * [1]
 * [1,1]
 * [1,2]
 * [1,2,1]
 */
function addNumbering(arr: TocItem[]) {
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    const depth = obj.depth;

    let _numbering: number[] = [];

    if (i === 0) {
      // construct an array with number 1 in depth size example [1, 1]
      _numbering = Array.from({ length: depth }, () => 1);
    } else {
      const prevLevel = arr[i - 1].numbering;
      const prevDepth = arr[i - 1].depth;

      if (!prevLevel) {
        _numbering = Array.from({ length: depth }, () => 1);
      } else if (depth === prevDepth) {
        const _temporary = [...prevLevel];
        const num = _temporary[depth - 1] + 1;

        _temporary[depth - 1] = num;
        _numbering = [..._temporary];
      } else if (depth > prevDepth) {
        const _temporary = [...prevLevel];

        _temporary.push(1);
        _numbering = [..._temporary];
      } else if (depth < prevDepth) {
        const _temporary = prevLevel.slice(0, depth);
        const num2 = _temporary[depth - 1] + 1;

        _temporary[depth - 1] = num2;
        _numbering = [..._temporary];
      }
    }

    obj.numbering = _numbering;
  }
}

const RemarkFlexibleToc: Plugin<[FlexibleTocOptions?], Root> = (options) => {
  const settings = Object.assign({}, DEFAULT_SETTINGS, options);

  return (tree, file) => {
    const slugger = new GithubSlugger();
    const tocItems: TocItem[] = [];

    visit(tree, "heading", (node, index, parent) => {
      const value = toString(node);
      const url = `#${slugger.slug(value)}`;
      const depth = node.depth;
      const parentType = parent?.type;

      if (!settings.levels!.includes(depth)) return CONTINUE;

      tocItems.push({
        value,
        url,
        depth,
        numbering: [],
        parent: parentType,
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
  };
};

export default RemarkFlexibleToc;
