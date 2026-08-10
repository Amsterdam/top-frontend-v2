import { type CSSProperties } from "react"
import { Column, Row, Skeleton } from "@amsterdam/design-system-react"

type CardTableSkeletonProps = {
  rows?: number
  columns?: number
}

type CardDescriptionSkeletonProps = {
  rows?: number
}

type CardParagraphSkeletonProps = {
  lines?: number
}

type CardListSkeletonProps = {
  items?: number
  linesPerItem?: number
}

const termStyle: CSSProperties = {
  flex: "0 0 35%",
}

const valueStyle: CSSProperties = {
  flex: "1 1 auto",
}

export function CardTableSkeleton({
  rows = 4,
  columns = 2,
}: CardTableSkeletonProps) {
  return (
    <Skeleton>
      <Skeleton.Table rows={rows} columns={columns} />
    </Skeleton>
  )
}

export function CardDescriptionSkeleton({
  rows = 6,
}: CardDescriptionSkeletonProps) {
  return (
    <Skeleton>
      <Column gap="small">
        {Array.from({ length: rows }, (_, index) => (
          <Row key={index} gap="large">
            <div style={termStyle}>
              <Skeleton.Paragraph lines={1} />
            </div>
            <div style={valueStyle}>
              <Skeleton.Paragraph lines={1} />
            </div>
          </Row>
        ))}
      </Column>
    </Skeleton>
  )
}

export function CardParagraphSkeleton({
  lines = 4,
}: CardParagraphSkeletonProps) {
  return (
    <Skeleton>
      <Skeleton.Paragraph lines={lines} />
    </Skeleton>
  )
}

export function CardListSkeleton({
  items = 3,
  linesPerItem = 2,
}: CardListSkeletonProps) {
  return (
    <Skeleton>
      <Column gap="large">
        {Array.from({ length: items }, (_, index) => (
          <Skeleton.Paragraph key={index} lines={linesPerItem} />
        ))}
      </Column>
    </Skeleton>
  )
}
