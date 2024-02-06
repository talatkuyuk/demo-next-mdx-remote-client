import type { BlockquoteHTMLAttributes, DetailedHTMLProps } from "react";

type BlockquoteProps = DetailedHTMLProps<
  BlockquoteHTMLAttributes<HTMLQuoteElement>,
  HTMLQuoteElement
>;

export default function CustomBlockQuote({
  children,
  ...props
}: BlockquoteProps) {
  return <blockquote {...props}>{children}</blockquote>;
}
