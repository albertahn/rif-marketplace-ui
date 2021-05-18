export type SupportedEventChannel = | 'API'
export type SupportedEvent = | 'SMARTCONTRACT' | 'NEWBLOCK'

export const SUPPORTED_EVENT_CHANNELS: Array<SupportedEventChannel> = ['API']
export const SUPPORTED_EVENTS: Array<SupportedEvent> = ['SMARTCONTRACT', 'NEWBLOCK']
export const SUPPORTED_API_CHANNEL_PROTOCOLS = ['http:', 'https:']
