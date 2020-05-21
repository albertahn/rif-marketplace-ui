import { ActionType } from 'store/storeUtils/interfaces'
import {
  MarketItemIface, MarketListingTypes, MarketItemType, MarketFilter,
} from 'models/Market'
import { TxType } from './MarketStore'

export enum MARKET_ACTIONS {
  NOOP = 'NOOP',
  SET_ITEMS = 'SET_ITEMS',
  SELECT_ITEM = 'SELECT_ITEM',
  SET_FILTER = 'SET_FILTER',
  TOGGLE_TX_TYPE = 'TOGGLE_TX_TYPE',
  CONNECT_SERVICE = 'CONNECT_SERVICE',
  SET_EXCHANGE_RATE = 'SET_EXCHANGE_RATE',
  CLEAN_UP = 'CLEAN_UP'
}

export interface ItemPayload {
  listingType: MarketListingTypes
  item: MarketItemIface
  txType: TxType
  isProcessing: boolean
}

export interface ListingPayload {
  listingType: MarketListingTypes
  items: MarketItemType[]
}

export interface FilterPayload {
  filterItems: MarketFilter
}

export interface ConnectionPayload {
  servicePath: string
  listingType: MarketListingTypes
  txType: TxType
}

export interface ExchangeRatePayload {
  [symbol: string]: {
    displayName: string
    rate: number
  }
}

export interface TxTypeChangePayload {
  txType: TxType
}

export type MarketPayloadType = ItemPayload & FilterPayload & ConnectionPayload & TxTypeChangePayload & ExchangeRatePayload & ListingPayload

export interface MarketAction extends ActionType<MarketPayloadType> {
  type: MARKET_ACTIONS
}
