import type { LayoutCount } from "@/types";

export type LayoutTemplate = {
  columns: string;
  rows: string;
  areas: string[];
  /** Default fractional track weights (before user resize). */
  colFr: number[];
  rowFr: number[];
};

export function frToTemplate(tracks: number[]): string {
  return tracks.map((t) => `${Math.max(0.08, t)}fr`).join(" ");
}

export function layoutKey(count: LayoutCount, orientation: "h" | "v") {
  return `${count}-${orientation}`;
}

export function layoutTemplate(
  count: LayoutCount,
  orientation: "h" | "v",
): LayoutTemplate {
  if (count === 1) {
    return {
      columns: "1fr",
      rows: "1fr",
      areas: ["1 / 1"],
      colFr: [1],
      rowFr: [1],
    };
  }
  if (count === 2) {
    return orientation === "v"
      ? {
          columns: "1fr",
          rows: "1fr 1fr",
          areas: ["1 / 1", "2 / 1"],
          colFr: [1],
          rowFr: [1, 1],
        }
      : {
          columns: "1fr 1fr",
          rows: "1fr",
          areas: ["1 / 1", "1 / 2"],
          colFr: [1, 1],
          rowFr: [1],
        };
  }
  if (count === 3) {
    return {
      columns: "1.35fr 1fr",
      rows: "1fr 1fr",
      areas: ["1 / 1 / 3 / 2", "1 / 2", "2 / 2"],
      colFr: [1.35, 1],
      rowFr: [1, 1],
    };
  }
  if (count === 4) {
    return {
      columns: "1fr 1fr",
      rows: "1fr 1fr",
      areas: ["1 / 1", "1 / 2", "2 / 1", "2 / 2"],
      colFr: [1, 1],
      rowFr: [1, 1],
    };
  }
  if (count === 5) {
    return {
      columns: "1fr 1fr 1fr",
      rows: "1fr 1fr",
      areas: ["1 / 1 / 2 / 3", "1 / 3", "2 / 1", "2 / 2", "2 / 3"],
      colFr: [1, 1, 1],
      rowFr: [1, 1],
    };
  }
  if (count === 6) {
    return orientation === "v"
      ? {
          columns: "1fr 1fr",
          rows: "1fr 1fr 1fr",
          areas: ["1 / 1", "1 / 2", "2 / 1", "2 / 2", "3 / 1", "3 / 2"],
          colFr: [1, 1],
          rowFr: [1, 1, 1],
        }
      : {
          columns: "1fr 1fr 1fr",
          rows: "1fr 1fr",
          areas: ["1 / 1", "1 / 2", "1 / 3", "2 / 1", "2 / 2", "2 / 3"],
          colFr: [1, 1, 1],
          rowFr: [1, 1],
        };
  }
  if (count === 7) {
    return {
      columns: "1.35fr 1fr 1fr",
      rows: "1fr 1fr 1fr",
      areas: [
        "1 / 1 / 4 / 2",
        "1 / 2",
        "1 / 3",
        "2 / 2",
        "2 / 3",
        "3 / 2",
        "3 / 3",
      ],
      colFr: [1.35, 1, 1],
      rowFr: [1, 1, 1],
    };
  }
  if (count === 8) {
    return {
      columns: "1fr 1fr 1fr 1fr",
      rows: "1fr 1fr",
      areas: [
        "1 / 1",
        "1 / 2",
        "1 / 3",
        "1 / 4",
        "2 / 1",
        "2 / 2",
        "2 / 3",
        "2 / 4",
      ],
      colFr: [1, 1, 1, 1],
      rowFr: [1, 1],
    };
  }
  if (count === 9) {
    return {
      columns: "1fr 1fr 1fr",
      rows: "1fr 1fr 1fr",
      areas: [
        "1 / 1",
        "1 / 2",
        "1 / 3",
        "2 / 1",
        "2 / 2",
        "2 / 3",
        "3 / 1",
        "3 / 2",
        "3 / 3",
      ],
      colFr: [1, 1, 1],
      rowFr: [1, 1, 1],
    };
  }
  if (count === 10) {
    return {
      columns: "1fr 1fr 1fr 1fr 1fr",
      rows: "1fr 1fr",
      areas: [
        "1 / 1",
        "1 / 2",
        "1 / 3",
        "1 / 4",
        "1 / 5",
        "2 / 1",
        "2 / 2",
        "2 / 3",
        "2 / 4",
        "2 / 5",
      ],
      colFr: [1, 1, 1, 1, 1],
      rowFr: [1, 1],
    };
  }
  if (count === 11) {
    return {
      columns: "repeat(12, 1fr)",
      rows: "1fr 1fr 1fr",
      areas: [
        "1 / 1 / 2 / 5",
        "1 / 5 / 2 / 9",
        "1 / 9 / 2 / 13",
        "2 / 1 / 3 / 4",
        "2 / 4 / 3 / 7",
        "2 / 7 / 3 / 10",
        "2 / 10 / 3 / 13",
        "3 / 1 / 4 / 4",
        "3 / 4 / 4 / 7",
        "3 / 7 / 4 / 10",
        "3 / 10 / 4 / 13",
      ],
      colFr: Array.from({ length: 12 }, () => 1),
      rowFr: [1, 1, 1],
    };
  }
  return {
    columns: "1fr 1fr 1fr 1fr",
    rows: "1fr 1fr 1fr",
    areas: [
      "1 / 1",
      "1 / 2",
      "1 / 3",
      "1 / 4",
      "2 / 1",
      "2 / 2",
      "2 / 3",
      "2 / 4",
      "3 / 1",
      "3 / 2",
      "3 / 3",
      "3 / 4",
    ],
    colFr: [1, 1, 1, 1],
    rowFr: [1, 1, 1],
  };
}

export const LAYOUT_COUNTS: LayoutCount[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
];
