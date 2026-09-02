export type EmailTemplateResult = {
  subject: string
  previewText: string
  html: string
}

export type EmailTemplateBuilder = (timeZone: string) => EmailTemplateResult
