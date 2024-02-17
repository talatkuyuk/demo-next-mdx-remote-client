import { Element, Properties } from "hast";
import { Code, Html } from "mdast";
import { State, Raw } from "mdast-util-to-hast";

/**
 * Turn an mdast `code` node into hast.
 *
 * by default, the language is not specified in `<pre>`,
 * so this handler adds the language information into the parent `<pre>`.
 * @see https://github.com/syntax-tree/mdast-util-to-hast/blob/master/lib/handlers/code.js
 *
 * @param {State} state
 *   Info passed around.
 * @param {Code} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function code(state: State, node: Code): Element {
  const value = node.value ? node.value + "\n" : "";
  const properties: Properties = {};

  if (node.lang) {
    properties.className = ["language-" + node.lang];
  }

  // Create `<code>`.
  let result: Element = {
    type: "element",
    tagName: "code",
    properties,
    children: [{ type: "text", value }],
  };

  if (node.meta) {
    result.data = { meta: node.meta };
  }

  state.patch(node, result);
  result = state.applyData(node, result);

  // Create `<pre>` with the same language.
  result = { type: "element", tagName: "pre", properties, children: [result] };
  state.patch(node, result);
  return result;
}

/**
 * Turn an mdast `html` node into hast (`raw` node in dangerous mode, otherwise nothing).
 *
 * this handler will skip the react components, and
 * designed for only markdown "md" format documents in the @mdx-js/mdx
 *
 * @param {State} state
 *   Info passed around.
 * @param {Html} node
 *   mdast node.
 * @returns {Element | Raw | undefined}
 *   hast node.
 */
export function html(state: State, node: Html): Element | Raw | undefined {
  if (state.options.allowDangerousHtml) {
    // check if it is a react component name pattern, then return undefined
    const component_name = node.value.match(/<([A-Z][^\/\s>]+)/)?.[1];
    if (component_name) return;

    const result: Raw = { type: "raw", value: node.value };
    state.patch(node, result);
    return state.applyData(node, result);
  }

  return undefined;
}
