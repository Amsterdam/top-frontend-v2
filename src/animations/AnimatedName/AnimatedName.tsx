import styles from "./AnimatedName.module.css"

type Props = {
  text: string
}

export function AnimatedName({ text }: Props) {
  return (
    <span className={styles.container}>
      {text.split("").map((letter, index) => (
        <span
          key={index}
          className={styles.letter}
          style={
            {
              "--delay": `${index * 40}ms`,
            } as React.CSSProperties
          }
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </span>
  )
}
