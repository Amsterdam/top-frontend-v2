import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { ToastContext } from "./ToastContext"
import { registerToastBridge } from "./toastBridge"
import { Toast } from "./Toast"
import type { ToastMessage } from "./types"
import styles from "./ToastProvider.module.css"

const TIME_TOAST_DISMISS = 4000
const TIMEOUT_FADE_OUT = 300
const REPOSITION_DURATION = 250

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const toastRefs = useRef(new Map<string, HTMLDivElement>())
  const prevTops = useRef(new Map<string, number>())

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (toast: Omit<ToastMessage, "id">) => {
      const id = crypto.randomUUID()
      setToasts((current) => [...current, { ...toast, id, visible: true }])

      if (toast.persistent || toast.action) return

      // Start fade-out
      setTimeout(() => {
        setToasts((current) =>
          current.map((t) => (t.id === id ? { ...t, visible: false } : t)),
        )
      }, TIME_TOAST_DISMISS - TIMEOUT_FADE_OUT)

      // Remove completely after fade-out
      setTimeout(() => removeToast(id), TIME_TOAST_DISMISS)
    },
    [removeToast],
  )

  const dismissToast = useCallback(
    (id: string) => {
      setToasts((current) =>
        current.map((t) => (t.id === id ? { ...t, visible: false } : t)),
      )
      setTimeout(() => removeToast(id), TIMEOUT_FADE_OUT)
    },
    [removeToast],
  )

  useEffect(() => {
    registerToastBridge(showToast)
  }, [showToast])

  // FLIP: existing toasts smoothly reposition when the stack changes
  // (a toast is added or removed), instead of jumping to their new spot.
  // Newly added toasts are left alone here; they play their own enter
  // animation (see animate-slide-in-bottom).
  //
  // Positions are measured as containerTop + offsetTop, not a plain
  // getBoundingClientRect() on the toast itself. getBoundingClientRect()
  // includes the element's current CSS transform, so a toast mid-way
  // through its slide-in-bottom entrance (or a still-settling reposition
  // transform) would get measured at its animated position instead of its
  // resting layout position - producing a bogus delta and a spurious "fly
  // back in" jump the next time the stack changed. offsetTop fixes that
  // (it's transform-independent), but it's relative to the container, and
  // the container itself (position: fixed; bottom: 1rem; height: auto)
  // shifts up/down as toasts are added/removed. So offsetTop alone misses
  // moves caused by the container resizing - e.g. dismissing the toast
  // closest to the corner shifts every toast above it, but their own
  // offsetTop never changes. The container has no transform of its own,
  // so its getBoundingClientRect().top is always safe to read directly;
  // adding it to offsetTop gives a viewport-absolute position that's both
  // transform-independent and container-shift-aware.
  useLayoutEffect(() => {
    const containerTop = containerRef.current?.getBoundingClientRect().top ?? 0
    const nextTops = new Map<string, number>()

    for (const toast of toasts) {
      const el = toastRefs.current.get(toast.id)
      if (!el || !toast.visible) continue

      const top = containerTop + el.offsetTop
      nextTops.set(toast.id, top)

      const prevTop = prevTops.current.get(toast.id)
      if (prevTop === undefined) continue

      const deltaY = prevTop - top
      if (deltaY === 0) continue

      el.style.transition = "none"
      el.style.transform = `translateY(${deltaY}px)`

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = `transform ${REPOSITION_DURATION}ms ease`
          el.style.transform = ""
        })
      })
    }

    prevTops.current = nextTops
  }, [toasts])

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      <div
        ref={containerRef}
        className={styles.toastContainer}
        style={
          {
            "--toast-exit-duration": `${TIMEOUT_FADE_OUT}ms`,
          } as React.CSSProperties
        }
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            ref={(el) => {
              if (el) toastRefs.current.set(toast.id, el)
              else toastRefs.current.delete(toast.id)
            }}
            toast={toast}
            onDismiss={() => dismissToast(toast.id)}
            className={
              toast.visible
                ? "animate-slide-in-bottom"
                : "animate-slide-out-bottom"
            }
          />
        ))}
      </div>
      {children}
    </ToastContext.Provider>
  )
}
