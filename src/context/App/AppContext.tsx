import { ServiceMap } from 'api/models/apiService'
import { ConfirmationsService } from 'api/rif-marketplace-cache/blockchain/confirmations'
import { XRService } from 'api/rif-marketplace-cache/rates/xr'
import { DomainsService } from 'api/rif-marketplace-cache/rns/domains'
import { OffersService } from 'api/rif-marketplace-cache/rns/offers'
import { SoldDomainsService } from 'api/rif-marketplace-cache/rns/sold'
import { StorageOffersService } from 'api/rif-marketplace-cache/storage/offers'
import { ContextActions, ContextReducer, ContextState } from 'context/storeUtils/interfaces'
import storeReducerFactory from 'context/storeUtils/reducer'
import {
  ErrorId, ErrorMessage, LoaderId, Message, MessageId,
} from 'models/UIMessage'
import React, { Dispatch, useReducer } from 'react'
import { Modify } from 'utils/typeUtils'
import {
  AppAction, appActions, AppPayload, AppReducer, ErrorMessagePayload,
} from './appActions'

export type ContextName = 'app'

export type MessageMap = Record<MessageId, Message | ErrorMessage>
export type LoaderMap = Record<LoaderId, boolean>

export interface AppState extends ContextState {
  loaders: LoaderMap
  messages: Partial<MessageMap>
  apis: ServiceMap
}

export interface AppContextProps {
  state: AppState
  dispatch: Dispatch<AppAction>
}

export const initialState: AppState = {
  contextID: 'app',
  apis: {
    confirmations: new ConfirmationsService(),
    'rns/v0/offers': new OffersService(),
    'rns/v0/domains': new DomainsService(),
    'rns/v0/sold': new SoldDomainsService(),
    'rates/v0': new XRService(),
    'storage/v0/offers': new StorageOffersService(),
  },
  messages: {},
  loaders: {
    contract: false,
    data: false,
    filters: false,
    other: false,
  },
}

const AppContext = React.createContext({} as AppContextProps | any)
const appReducer: AppReducer<AppPayload> | ContextReducer = storeReducerFactory(initialState, appActions as unknown as ContextActions)

export type ErrorReporterError = Modify<Omit<ErrorMessagePayload, 'type'>, {
  id: ErrorId
}>
export interface ErrorReporter {
  (error: ErrorReporterError): void
}
export interface ErrorReporterFactory {
  (dispatch: Dispatch<AppAction>): ErrorReporter
}

export const errorReporterFactory: ErrorReporterFactory = (dispatch: Dispatch<AppAction>) => (error: ErrorReporterError) => {
  dispatch({
    type: 'SET_MESSAGE',
    payload: {
      ...error,
      type: 'error',
    } as ErrorMessagePayload,
  })
}
export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const value = { state, dispatch }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContext