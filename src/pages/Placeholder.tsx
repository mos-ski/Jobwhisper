interface Props {
  title: string
}

export default function Placeholder({ title }: Props) {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground">{title} — coming soon</p>
    </div>
  )
}
