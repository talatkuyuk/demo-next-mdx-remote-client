import { type Plugin } from "unified";
import { type Root } from "mdast";
import { visit, CONTINUE } from "unist-util-visit";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";

export type HeadingParents =
  | "root"
  | "blockquote"
  | "footnoteDefinition"
  | "listItem"
  | "container"
  | "mdxJsxFlowElement";

export type HeadingDepths = 1 | 2 | 3 | 4 | 5 | 6;

export type TocItem = {
  value: string;
  href: string;
  depth: HeadingDepths;
  numbering: HeadingDepths[];
  parent: HeadingParents;
  data?: Record<string, unknown>;
};

/**
 * tocName (default: "toc") - the key name which is attached into vfile.data
 * tocRef (default: []) — another way of exposing the tocItems
 * maxDepth (default: 6) — max heading depth to include in the table of contents; this is inclusive: when set to 3, level three headings are included
 * exclude — headings to skip, wrapped in new RegExp('^(' + value + ')$', 'i'); any heading matching this expression will not be present in the table of contents
 * skipLevels (default: [1]) — disallowed heading levels, by default the article h1 is not expected to be in the TOC
 * skipParents (default: []) — disallow headings to be children of certain node types, (the "root" can not skipped)
 * prefix - the text that will be attached to headings as prefix, like "text-prefix-"
 * fallback - It is a fallback function to take the array of toc items as an argument
 */
export type FlexibleTocOptions = {
  tocName?: string;
  tocRef?: TocItem[];
  maxDepth?: HeadingDepths;
  exclude?: string | string[];
  skipLevels?: HeadingDepths[];
  skipParents?: Exclude<HeadingParents, "root">[];
  prefix?: string;
  fallback?: <T = undefined>(toc: TocItem[]) => T;
};

type RequiredFlexibleTocOptions = Required<FlexibleTocOptions> & {
  prefix?: FlexibleTocOptions["prefix"];
  fallback?: FlexibleTocOptions["fallback"];
};

const DEFAULT_SETTINGS: FlexibleTocOptions = {
  tocName: "toc",
  tocRef: [],
  maxDepth: 6,
  skipLevels: [1],
  skipParents: [],
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

    let numbering: HeadingDepths[] = [];

    const prevObj = i > 0 ? arr[i - 1] : undefined;
    const prevDepth = prevObj ? prevObj.depth : undefined;
    const prevNumbering = prevObj ? prevObj.numbering : undefined;

    if (!prevNumbering || !prevDepth) {
      numbering = Array.from({ length: depth }, () => 1);
    } else if (depth === prevDepth) {
      numbering = [...prevNumbering];
      numbering[depth - 1]++;
    } else if (depth > prevDepth) {
      numbering = [
        ...prevNumbering,
        ...(Array.from(
          { length: depth - prevDepth },
          () => 1
        ) as HeadingDepths[]),
      ]; // tricky here, if depth is more bigger than prevDepth, put more 1 inside the array
    } else if (depth < prevDepth) {
      numbering = prevNumbering.slice(0, depth);
      numbering[depth - 1]++;
    }

    tocItem.numbering = numbering;
  }
}

const RemarkFlexibleToc: Plugin<[FlexibleTocOptions?], Root> = (options) => {
  const settings = Object.assign(
    {},
    DEFAULT_SETTINGS,
    options
  ) as RequiredFlexibleTocOptions;

  const exludeRegexFilter = settings.exclude
    ? Array.isArray(settings.exclude)
      ? new RegExp(settings.exclude.join("|"), "i")
      : new RegExp(settings.exclude, "i")
    : new RegExp("(?!.*)");

  return (tree, file) => {
    const slugger = new GithubSlugger();
    const tocItems: TocItem[] = [];

    visit(tree, "heading", (_node, _index, _parent) => {
      if (!_parent) return;

      const depth = _node.depth;
      const value = toString(_node, { includeImageAlt: false });
      const href = `#${settings.prefix ?? ""}${slugger.slug(value)}`;
      const parent = _parent.type;

      // maxDepth check
      if (depth > settings.maxDepth) return CONTINUE;

      // skipLevels check
      if (settings.skipLevels.includes(depth)) return CONTINUE;

      // skipParents check
      if (parent !== "root" && settings.skipParents.includes(parent)) {
        return CONTINUE;
      }

      // exclude check
      if (exludeRegexFilter.test(value)) return CONTINUE;

      // Other remark plugins can store custom data in node.data.hProperties
      // I omitted node.data.hName and node.data.hChildren since not related with toc
      const data = _node.data?.hProperties
        ? { ..._node.data.hProperties }
        : undefined;

      tocItems.push({
        value,
        href,
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
