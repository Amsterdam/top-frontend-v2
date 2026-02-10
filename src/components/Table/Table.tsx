import React, { useState } from "react"
import styles from "./Table.module.css"
import { getNestedValue } from "./utils"
import { Icon } from "@amsterdam/design-system-react"
import { ChevronDownIcon } from "@amsterdam/design-system-react-icons"

type Column<T> = {
  title: string
  dataIndex: string
  render?: (value: unknown, row: T) => React.ReactNode
}

type Expandable<T> = {
  expandedRow: (record: T) => React.ReactNode
}

type TableProps<T extends Record<string, unknown>> = {
  columns: readonly Column<T>[]
  data: readonly T[]
  expandable?: Expandable<T>
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  expandable,
}: TableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const toggleRow = (index: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const hasExpandable = Boolean(expandable)

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} className={styles.tableTitleCell}>
              {column.title}
            </th>
          ))}
          {hasExpandable && (
            <th className={styles.tableChevronCell}>Details</th>
          )}
        </tr>
      </thead>

      <tbody>
        {data.map((row, rowIndex) => {
          const isExpanded = expandedRows.has(rowIndex)

          return (
            <React.Fragment key={rowIndex}>
              <tr
                className={`${styles.tableRow} ${
                  hasExpandable ? styles.tableExpandableRow : ""
                }`}
                onClick={hasExpandable ? () => toggleRow(rowIndex) : undefined}
                aria-expanded={isExpanded}
              >
                {columns.map((column, columnIndex) => {
                  const value = getNestedValue(row, column.dataIndex)
                  return (
                    <td key={columnIndex} className={styles.tableCell}>
                      {column.render
                        ? column.render(value, row)
                        : ((value as React.ReactNode) ?? "")}
                    </td>
                  )
                })}

                {hasExpandable && (
                  <td className={styles.tableChevronCell}>
                    <span
                      className={`${styles.chevron} ${
                        isExpanded ? styles.chevronOpen : ""
                      }`}
                    >
                      <Icon svg={ChevronDownIcon} size="heading-3" />
                    </span>
                  </td>
                )}
              </tr>

              {hasExpandable && (
                <tr className={styles.tableExpandedRow}>
                  <td
                    colSpan={columns.length + 1}
                    className={styles.tableExpandedCell}
                  >
                    <div
                      className={`${styles.tableCollapsibleContent} ${
                        isExpanded ? styles.tableCollapsibleOpen : ""
                      }`}
                    >
                      <div className={styles.tableCollapsibleInner}>
                        <div className={styles.tableExpandedContent}>
                          {expandable?.expandedRow(row)}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          )
        })}
      </tbody>
    </table>
  )
}
