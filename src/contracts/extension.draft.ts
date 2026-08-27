export type ExtensionBoardState = 'start' | 'connect' | 'in-progress'

export type ExtensionJobBoard = {
  readonly id: string
  readonly name: string
  readonly state: ExtensionBoardState
}
