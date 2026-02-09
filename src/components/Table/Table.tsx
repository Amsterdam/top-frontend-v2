import React, { useState } from "react"
import styles from "./Table.module.css"
import { getNestedValue } from "./utils"

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

  return (
    <table className={styles.Table}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} className={styles.TableTitleCell}>
              {column.title}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, rowIndex) => {
          const isExpanded = expandedRows.has(rowIndex)

          return (
            <React.Fragment key={rowIndex}>
              <tr
                className={`${expandable ? styles.TableExpandableRow : ""}`}
                onClick={expandable ? () => toggleRow(rowIndex) : undefined}
                aria-expanded={isExpanded}
              >
                {columns.map((column, columnIndex) => {
                  const value = getNestedValue(row, column.dataIndex)
                  return (
                    <td key={columnIndex} className={styles.TableCell}>
                      {column.render
                        ? column.render(value, row)
                        : ((value as React.ReactNode) ?? "")}
                    </td>
                  )
                })}
              </tr>

              {expandable && (
                <tr className={styles.TableExpandedRow}>
                  <td
                    colSpan={columns.length}
                    className={styles.TableExpandedCell}
                  >
                    <div
                      className={`${styles.TableCollapsibleContent} ${isExpanded ? styles.TableCollapsibleOpen : ""}`}
                    >
                      <div className={styles.TableCollapsibleInner}>
                        <div className={styles.TableExpandedContent}>
                          {expandable.expandedRow(row)}
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
