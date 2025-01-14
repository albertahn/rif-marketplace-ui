import { StakedBalances } from 'api/rif-marketplace-cache/storage/stakes'
import { Dispatch } from 'react'
import { SupportedTokenSymbol } from 'models/Token'
import { ContextState } from 'context/storeUtils/interfaces'

export type AmountToken = {
  amount: string
  token: SupportedTokenSymbol
}
// STATE
export const contextName = 'storage_staking' as const
export type ContextName = typeof contextName

export type State = ContextState & {
  needsRefresh: boolean
  totalStakedUSD: string
  stakes: StakedBalances
}

// ACTIONS
export type Action =
  | {
      type: 'SET_NEEDS_REFRESH'
      payload: { needsRefresh: boolean }
    }
  | {
      type: 'SET_TOTAL_STAKED_USD'
      payload: { totalStakedUSD: string }
    }
  | {
      type: 'SET_STAKES'
      payload: StakedBalances
    }

export type Actions = {
  SET_NEEDS_REFRESH: (state: State, { needsRefresh: boolean }) => State
  SET_TOTAL_STAKED_USD: (state: State, { totalStakedUSD: string }) => State
  SET_STAKES: (state: State, stakes: StakedBalances) => State
}

// PROPS
export type Props = {
  state: State
  dispatch: Dispatch<Action>
}
