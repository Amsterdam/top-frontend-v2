import React, { useState } from "react"
import styles from "./Table.module.css"
import { getNestedValue } from "./utils"
import { Icon, Table as ADSTable } from "@amsterdam/design-system-react"
import { ChevronDownIcon } from "@amsterdam/design-system-react-icons"

type Column<T> = {
  title: string
  dataIndex: string
  render?: (value: unknown, row: T) => React.ReactNode
  hideOnMobile?: boolean
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
    <ADSTable className={styles.table}>
      <ADSTable.Header>
        <ADSTable.Row>
          {columns.map((column, index) => (
            <ADSTable.HeaderCell
              key={index}
              className={`${styles.tableTitleCell} ${
                column.hideOnMobile ? styles.hideOnMobile : ""
              }`}
            >
              {column.title}
            </ADSTable.HeaderCell>
          ))}
          {hasExpandable && (
            <ADSTable.HeaderCell className={styles.tableChevronCell}>
              Details
            </ADSTable.HeaderCell>
          )}
        </ADSTable.Row>
      </ADSTable.Header>

      <ADSTable.Body>
        {data.map((row, rowIndex) => {
          const isExpanded = expandedRows.has(rowIndex)

          return (
            <React.Fragment key={rowIndex}>
              <ADSTable.Row
                className={`${styles.tableRow} ${
                  hasExpandable ? styles.tableExpandableRow : ""
                }`}
                onClick={hasExpandable ? () => toggleRow(rowIndex) : undefined}
                aria-expanded={isExpanded}
              >
                {columns.map((column, columnIndex) => {
                  const value = getNestedValue(row, column.dataIndex)
                  return (
                    <ADSTable.Cell
                      key={columnIndex}
                      className={`${styles.tableCell} ${
                        column.hideOnMobile ? styles.hideOnMobile : ""
                      }`}
                    >
                      {column.render
                        ? column.render(value, row)
                        : ((value as React.ReactNode) ?? "")}
                    </ADSTable.Cell>
                  )
                })}

                {hasExpandable && (
                  <ADSTable.Cell className={styles.tableChevronCell}>
                    <span
                      className={`${styles.chevron} ${
                        isExpanded ? styles.chevronOpen : ""
                      }`}
                    >
                      <Icon svg={ChevronDownIcon} size="heading-3" />
                    </span>
                  </ADSTable.Cell>
                )}
              </ADSTable.Row>

              {hasExpandable && (
                <ADSTable.Row className={styles.tableExpandedRow}>
                  <ADSTable.Cell
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
                  </ADSTable.Cell>
                </ADSTable.Row>
              )}
            </React.Fragment>
          )
        })}
      </ADSTable.Body>
    </ADSTable>
  )
}
