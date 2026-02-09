import React from "react"
import clsx from "clsx"
import { capitalize } from "@/shared"
import styles from "./Flex.module.css"

type Direction = "row" | "column"
type Justify = "start" | "center" | "end" | "between"
type Align = "start" | "center" | "end"
type Gap = "small" | "medium" | "large" | "none"
type Margin = "small" | "medium" | "large" | "none"

type FlexProps = {
  children: React.ReactNode
  direction?: Direction
  justify?: Justify
  align?: Align
  gap?: Gap
  margin?: Margin
  className?: string
}

export function Flex({
  children,
  direction = "column",
  justify = "center",
  align = "center",
  gap = "medium",
  margin = "none",
  className,
}: FlexProps) {
  return (
    <div
      className={clsx(
        styles.flex,
        styles[direction],
        styles[`justify${capitalize(justify)}`],
        styles[`align${capitalize(align)}`],
        gap !== "none" && styles[`gap${capitalize(gap)}`],
        margin !== "none" && styles[`margin${capitalize(margin)}`],
        className,
      )}
    >
      {children}
    </div>
  )
}
