import { Link } from 'react-router-dom'

const VARIANTS = {
  primary: 'bg-violet-600 hover:bg-violet-700 text-white border-transparent',
  ghost: 'bg-violet-50 hover:bg-violet-100 text-ink-900 border-violet-300',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent',
  subtle: 'bg-transparent hover:bg-violet-50 text-ink-700 border-transparent',
}

export function Button({ as = 'button', variant = 'primary', className = '', ...props }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium
    transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`
  if (as === 'link') {
    const { to, children, ...rest } = props
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    )
  }
  return <button className={cls} {...props} />
}

export function Field({ label, htmlFor, error, hint, children, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label className="label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
      {error && (
        <p className="err" id={`${htmlFor}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function Input({ error, className = '', ...props }) {
  return (
    <input
      className={`field ${error ? 'field-error' : ''} ${className}`}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${props.id}-error` : undefined}
      {...props}
    />
  )
}

export function Textarea({ error, className = '', ...props }) {
  return (
    <textarea
      className={`field ${error ? 'field-error' : ''} ${className}`}
      aria-invalid={error ? 'true' : undefined}
      {...props}
    />
  )
}

export function Select({ error, className = '', children, ...props }) {
  return (
    <select className={`field ${error ? 'field-error' : ''} ${className}`} {...props}>
      {children}
    </select>
  )
}

export function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-block rounded-full border border-violet-400 bg-violet-100 px-2.5 py-0.5
        text-xs text-violet-700 ${className}`}
    >
      {children}
    </span>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="h-14 w-14 rounded-full border-4 border-violet-300 border-t-violet-500" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
      {description && <p className="max-w-sm text-sm text-ink-700">{description}</p>}
      {action}
    </div>
  )
}

export function SectionTitle({ children }) {
  return (
    <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-violet-700">{children}</h2>
  )
}
