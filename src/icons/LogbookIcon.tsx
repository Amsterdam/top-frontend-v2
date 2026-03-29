type IconProps = {
  color?: string
  size?: number
  className?: string
}

export const LogbookIcon: React.FC<IconProps> = ({
  color = "currentColor",
  size = "1em",
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    stroke={color}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 14v2.2l1.6 1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v.832" />
    <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2" />
    <circle cx="16" cy="16" r="6" />
    <rect x="8" y="2" width="8" height="4" rx="1" />
  </svg>
)
