"use client";

import React from "react";

import { type TocItem } from "../utils/plugin";
import styles from "./Toc.module.css";

type Props = {
  toc: TocItem[];
  addNumbering?: boolean;
};

const Toc = ({ toc, addNumbering }: Props) => {
  if (!toc) return null;

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
        {toc.map((heading) => (
          <li key={heading.value} className={styles[`h${heading.depth}indent`]}>
            <a href={heading.url}>
              <div className={`h${heading.depth}`}>
                {addNumbering ? (
                  <span className={styles["numbering"]}>
                    {heading.numbering?.slice(1).join(".")}
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
