import { getFrontmatter } from "next-mdx-remote-server/utils";

import { Frontmatter } from "@/types";

export function getRandomInteger(min: number, max: number): number {
  min = Math.max(0, min);

  const randomFraction = Math.random();

  const randomInteger = Math.floor(randomFraction * (max - min + 1)) + min;

  return randomInteger;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const obtainFrontmatter = (source: string): Frontmatter => {
  const frontmatter = getFrontmatter<Frontmatter>(source).frontmatter;

  return frontmatter;
};
