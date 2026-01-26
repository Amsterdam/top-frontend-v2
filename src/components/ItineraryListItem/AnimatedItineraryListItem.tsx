type AnimatedItineraryListItemProps = {
  index: number
  children: React.ReactNode
}

export function AnimatedItineraryListItem({
  index,
  children,
}: AnimatedItineraryListItemProps) {
  return (
    <div
      className="animate-slide-in-fwd-bottom"
      style={{
        animationDelay: `${index * 0.1}s`,
        // borderBottom: "1px solid var(--ams-color-separator)",
      }}
    >
      {children}
    </div>
  )
}
