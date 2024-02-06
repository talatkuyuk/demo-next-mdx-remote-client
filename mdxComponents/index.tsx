import dynamic from "next/dynamic";
import Image from "next/image";
import { type MDXComponents } from "next-mdx-remote-server/rsc";

import CountButton from "./CountButton";
import Hello from "./Hello";
import ContextConsumer from "./ContextConsumer";
import CustomBlockQuote, { default as blockquote } from "./CustomBlockQuote";
import Button from "./Button";
import Toc from "./Toc";
// import CustomImage from "./CustomImage";

export const mdxComponents: MDXComponents = {
  CountButton,
  Hello,
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="custom-strong" {...props} />
  ),
  Dynamic: dynamic(() => import("./dynamic")),
  wrapper: (props: { children: any }) => {
    return <div id="mdx-layout">{props.children}</div>;
  },
  Image, // Image: CustomImage,
  blockquote,
  CustomBlockQuote,
  Button,
  Toc,
};

export const mdxComponentsWithContext = {
  ...mdxComponents,
  ContextConsumer,
};
