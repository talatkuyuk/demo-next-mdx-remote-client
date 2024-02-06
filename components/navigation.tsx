"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Navigation = () => {
  const path = usePathname();
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    setCurrent(path?.substring(1) || "main");
  }, []);

  const getStyle = (current_: string | null) => ({
    textDecoration: current === current_ ? "underline" : "unset",
    color: current === current_ ? "blue" : "black",
  });

  const onClick = (current: string | null) => {
    return () => {
      setCurrent(current);
    };
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        columnGap: "2rem",
        marginBottom: "1rem",
      }}
    >
      <Link href="/" onClick={onClick("main")} style={getStyle("main")}>
        Main
      </Link>
      <Link
        href="/static-docs"
        onClick={onClick("static-docs")}
        style={getStyle("static-docs")}
      >
        Static Docs
      </Link>
      <Link
        href="/dynamic-docs"
        onClick={onClick("dynamic-docs")}
        style={getStyle("dynamic-docs")}
      >
        Dynamic Docs
      </Link>
      <Link
        href="/static-blog"
        onClick={onClick("static-blog")}
        style={getStyle("static-blog")}
      >
        Static Blog
      </Link>
      <Link
        href="/dynamic-blog"
        onClick={onClick("dynamic-blog")}
        style={getStyle("dynamic-blog")}
      >
        Dynamic Blog
      </Link>
      <Link
        href="/lazy-blog"
        onClick={onClick("lazy-blog")}
        style={getStyle("lazy-blog")}
      >
        Lazy Blog
      </Link>
      <Link href="/about" onClick={onClick("about")} style={getStyle("about")}>
        About
      </Link>
    </div>
  );
};

export default Navigation;
