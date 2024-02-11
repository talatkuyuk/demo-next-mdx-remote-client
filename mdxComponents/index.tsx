import dynamic from "next/dynamic";
import Image from "next/image";
import { type MDXComponents } from "next-mdx-remote-client/rsc";

import Button from "./Button";
import CountButton from "./CountButton";
import Hello from "./Hello";
import ContextConsumer from "./ContextConsumer";
import Toc from "./Toc";
import BlockQuote, { default as blockquote } from "./BlockQuote";
import Admonition, { admonition } from "./Admonition";
import Link from "next/link";
// import CustomImage from "./CustomImage";

export const mdxComponents: MDXComponents = {
  Button,
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
  Link,
  Toc,
  blockquote,
  BlockQuote,
  admonition,
  Admonition,
};

export const mdxComponentsWithContext = {
  ...mdxComponents,
  ContextConsumer,
};
