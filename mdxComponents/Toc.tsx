"use client";

import { clsx } from "clsx";
import { type TocItem } from "../utils/plugin";

import styles from "./Toc.module.css";

// toc - an array of Table of Content's items provided by the remark plugin "remark-flexible-toc"
// maxDepth (default: 6) — max heading depth to include in the table of contents; this is inclusive: when set to 3, level three headings are included (those with three hashes, ###)
// indented (default: false) — whether to add indent to list items according to heading levels, otherwise not added
// ordered (default: false) — whether to add numbering to list items as an ordered list, otherwise not added
// tight (default: false) — whether to compile list items tightly, otherwise space is added around items
// exclude — headings to skip, wrapped in new RegExp('^(' + value + ')$', 'i'); any heading matching this expression will not be present in the table of contents
// skip — disallow headings to be children of certain node types,(if the parent is "root", it is not skipped)
type Props = {
  toc: TocItem[];
  maxDepth?: number;
  indented?: boolean;
  ordered?: boolean;
  tight?: boolean;
  exclude?: string | string[];
  skip?: Array<Exclude<TocItem["parent"], "root">>;
};

const Toc = ({
  toc,
  maxDepth = 6,
  ordered,
  indented,
  tight,
  skip = [],
  exclude,
}: Props) => {
  if (!toc) return null;

  // ********* filtering **************
  const exludeRE = exclude
    ? Array.isArray(exclude)
      ? new RegExp(exclude.join("|"), "i")
      : new RegExp(exclude, "i")
    : new RegExp("(?!.*)");

  const skipFilter = (parent: TocItem["parent"]): boolean =>
    parent !== "root" && skip.includes(parent);

  const maxDepthFilter = (depth: number): boolean => depth <= maxDepth;

  const filteredToc = toc.filter(
    (heading) =>
      maxDepthFilter(heading.depth) &&
      !skipFilter(heading.parent) &&
      !exludeRE.test(heading.value)
  );

  return (
    <details
      className={styles["toc-container"]}
      onClick={(e) => {
        e.currentTarget.classList.toggle(styles.close);
      }}
      open
    >
      <summary className={styles["toc-title"]}>
        <strong>VERY SIMPLE TABLE OF CONTENTS</strong>
      </summary>
      <ul className={styles["toc-list"]}>
        {filteredToc.map((heading) => (
          <li
            key={heading.value}
            className={clsx(
              indented && styles[`h${heading.depth}indent`],
              tight && styles["tight"]
            )}
          >
            <a href={heading.url}>
              <div className={`h${heading.depth}`}>
                {ordered ? (
                  <span className={styles["numbering"]}>
                    {heading.numbering.slice(1).join(".")}
                  </span>
                ) : null}
                <span className={styles["heading"]}>{heading.value}</span>
                <span className={styles["href"]}>{heading.url}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default Toc;
