import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import { cn } from './cn'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'size-6 text-xs',
  sm: 'size-8 text-sm',
  md: 'size-10 text-base',
  lg: 'size-12 text-lg',
  xl: 'size-16 text-xl',
}

export type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  readonly src?: string
  readonly alt?: string
  readonly name?: string
  readonly size?: AvatarSize
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  function Avatar({ src, alt, name = '', size = 'md', className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="avatar"
        data-size={size}
        className={cn(
          'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-subtle font-semibold text-accent',
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt || name} className="size-full object-cover" />
        ) : (
          <span aria-hidden="true">{name ? getInitials(name) : null}</span>
        )}
      </div>
    )
  },
)
