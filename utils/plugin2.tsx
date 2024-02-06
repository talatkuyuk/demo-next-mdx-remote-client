import { EXIT, SKIP, visit } from "estree-util-visit";
import type { Node } from "estree";

type RecmaMdxPropsPragmaOptions = {
  funcName?: string;
  propName?: string;
  propAs?: string;
};

const DEFAULT_SETTINGS: RecmaMdxPropsPragmaOptions = {
  funcName: "_createMdxContent",
  propName: "props",
  propAs: "_props",
};

/**
 * It is a recma plugin which transforms the esAST / esTree.
 *
 * This recma plugin
 *
 * The "recma-mdx-props-pragma" basically:
 *
 * inserts the Empty Component definition into code
 *
 * const _EmptyComponent = () => null;
 *
 * looks for a declaration statement in an object pattern initiated by the `_components`
 *
 * const { Component1, Component2 } = _components;
 *
 * converts it as the destructed properties (Components) having a default value
 *
 * const { Component1 = _EmptyComponent, Component2 = _EmptyComponent } = _components;
 *
 * @param [propsPragma = "props"]
 * @param [propsPragmaFallback = (propsPragma) => "_props"]
 */
export default function recmaMdxChangeProps(
  options: RecmaMdxPropsPragmaOptions = {}
) {
  const settings = Object.assign(
    {},
    DEFAULT_SETTINGS,
    options
  ) as Required<RecmaMdxPropsPragmaOptions>;

  return (tree: Node) => {
    let functionNode: Node;

    // finds the "function _createMdxContent(props){...}" and changes the param "props" as "_props"
    visit(tree, (node, _, index) => {
      if (!index) return;

      if (node.type !== "FunctionDeclaration") return SKIP;

      if (node.id.name !== settings.funcName) return SKIP;

      functionNode = node;

      node.params.forEach((param) => {
        if (param.type === "Identifier" && param.name === settings.propName) {
          param.name = settings.propAs;

          return;
        }
      });

      const statements = node.body.body;

      statements.forEach((s) => {
        if (s.type === "VariableDeclaration") {
          const declarations = s.declarations;

          declarations.forEach((d) => {
            if (d.id.type === "Identifier" && d.id.name === "_components") {
              if (d.init?.type === "ObjectExpression") {
                const properties = d.init.properties;

                properties.forEach((p) => {
                  if (
                    p.type === "SpreadElement" &&
                    p.argument.type === "MemberExpression"
                  ) {
                    p.argument.object.type === "Identifier" &&
                      p.argument.object.name === settings.propName &&
                      (p.argument.object.name = settings.propAs);
                  }
                });
              }
            }
          });
        }
      });

      // finds the "const _components = ..." definition
      // visit(functionNode, (_node) => {
      //   console.log(_node.type);

      //   if (_node.type !== "VariableDeclarator") return SKIP;

      //   if (_node.id.type !== "Identifier") return SKIP;

      //   if (_node.id.name !== "_components") return SKIP;

      //   // finds the "...props.components" and updates it as "..._props.components"
      // });
    });

    // visit(tree, (__node) => {
    //   if (__node.type !== "SpreadElement") return SKIP;

    //   if (
    //     __node.argument.type === "MemberExpression" &&
    //     __node.argument.object.type === "Identifier" &&
    //     __node.argument.object.name === settings.propName
    //   ) {
    //     __node.argument.object.name = settings.propAs;

    //     return EXIT;
    //   }
    // });
  };
}
