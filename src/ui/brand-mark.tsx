import type { ImgHTMLAttributes, SVGProps } from 'react'

export type JobwhisperAiIconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>

export function JobwhisperAiIcon(props: JobwhisperAiIconProps) {
  return <img src="/v3-assets/Vector.svg" alt="" aria-hidden="true" {...props} />
}

export function JobwhisperMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 165 28.6764" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Jobwhisper" {...props}>
      <path
        d="M16.2277 1.17408L11.9501 11.2604C11.8572 11.4794 11.8615 11.7275 11.962 11.9432L13.5248 15.2964C13.7843 15.8532 13.3778 16.4912 12.7634 16.4912H0.841681C0.0959667 16.4912 -0.28 15.5919 0.24384 15.0611L14.8565 0.256039C15.5072 -0.403145 16.5893 0.321409 16.2277 1.17408Z"
        className="fill-brand-mark-accent"
      />
      <path
        d="M29.445 12.3342L13.8061 28.4146C13.1352 29.1045 12.0196 28.3076 12.4546 27.4493L18.0955 16.319C18.2121 16.089 18.2165 15.8182 18.1076 15.5844L16.552 12.2465C16.2943 11.6937 16.6931 11.0593 17.3029 11.0517L28.8324 10.9086C29.5801 10.8993 29.9663 11.7981 29.445 12.3342Z"
        fill="currentColor"
      />
      <text x="37" y="21.5" fill="currentColor" fontFamily="'Instrument Sans', system-ui, sans-serif" fontWeight="700" fontSize="19" letterSpacing="-0.2">
        Jobwhisper
      </text>
    </svg>
  )
}
