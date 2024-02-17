---
title: "Test MDX Syntax in Markdown 'md' File"
author: "markdown"
---

::: note
I kept the document structure **the same** to see how markdown behaves to javascript expressions in curlybraces `{}` and mdx syntax.
:::

import Bar from "../../../mdxComponents/Bar.mjs";

_Read in {readingTime}, written by <Link href="#">**{frontmatter.author}**</Link>_

# {frontmatter.title}

<Toc toc={toc} ordered indented maxDepth={5} tight />

## Section 1

### Heading For Components

<Hello name={props.foo} />

<CountButton />

<Bar status={frontmatter.disableImports} />

<Dynamic />

### Heading For Plugins

#### SubHeading For Flexible Markers

Marked texts: ==text with yellow==, =r=text with red==, =g=text with green==, and =b=text with blue==.

#### SubHeading For Emojies

Some **markdown** _content_ :+1:

#### SubHeading For Flexible Paragraphs

~a|> Alert Text Centered
~w:> Warning Text Aligned Right

#### SubHeading For Flexible Containers

::: warning 
All **JSX syntax** is omitted by the `remark` parser in markdown.

All **javascript statements** in `{ }` are considered as just text in markdown.
:::

::: tip
<span>The **markdown syntax** inside **a block-level `HTML` element** like `<p>` or `<details>` doesn't work in markdown, but works in **inline-level `HTML` elements** like `<span>`.</span>
:::

::: danger Pay Attention
The `allowDangerousHtml` is set to `true` by default in `mdx-js/mdx`. If the file is markdown "md" format, `html` elements are removed in case you don't use `rehype-raw` plugin.
<details>
  <summary>**Markdown syntax doesn't work in details-summary**</summary>
  + List item - 1
  + List item - 2
  <p>_The markdown list syntax also doesn't work !_</p>
</details>
:::

::: info Table of Contents (TOC)
The remark plugin `remark-toc` is one of the tool for creating TOC inline in the markdown files.
:::

### Heading For Code Highlighting

```typescript:demo.ts
// prettier-ignore
function Text(text: string) {console.log(text)}
const text = "next-mdx-remote";
Text(text);
```

export function factorial(factor) {
  if (factor <= 1) {
    return 1;
  }
  return factor * factorial(factor - 1);
}

## Section 2

### Heading For GFM

Autolink www.example.com and `inline code`.

~one tilde strikethrough~ or ~~two tildes strikethrough~~

| Left Aligned Header  | Right Aligned Header |
| :------------------- | -------------------: |
| Content Cell         | Content Cell         |
| Content Cell         | Content Cell         |

### Heading For Miscellenous

#### SubHeading for Lists

+ List item with Normal text
+ List item with **Bold text**
+ List item with *Italic text*
+ #### Heading-4 in list
+ ##### Heading-5 in list

#### SubHeading For Escapes

"Authorize \<GITHUB_USER>"

version of \<operation>.\<mount> \<= 1.3.x

< 8ms (allowed one blank after "\<")

escape opening curlybraces "\{}"

#### SubHeading For Centering

~|> Centering **text** and **image** is very easy !
~|> <Image src="/images/cover.png" alt="cover" width={180} height={40} />
~|> ![cover](/images/cover.png)

#### SubHeading For Blockquates

> The `@import` is used to **import style rules** from other valid stylesheets.
> <span>=g=blockquate markdown element==</span>

<BlockQuote>
  A custom `remark-rehype` handler made all React Components stripped out, including this. If would not, what would happened? All component names are lowercased by `rehype-raw` via `parse5` parser. This component name also would became `blockquote` luckily after lowercased and would be valid HTML tag as well. Additionally If I put empty lines inside, markdown syntax will work in the `blockquote` block-level HTML element. <span>=g=blockquate html element==</span>
</BlockQuote>

export const num = 6;

#### SubHeading For Mixing Markdown and HTML

<div class="note">
A mix of *markdown* and <em>HTML</em>.
</div>

<div class="note">
  A mix of *markdown* and <em>HTML</em>.
</div>

<div class="note">A mix of *markdown* and <em>HTML</em>.</div>

<div class="note">

A mix of *markdown* and <em>HTML</em>.

</div>

