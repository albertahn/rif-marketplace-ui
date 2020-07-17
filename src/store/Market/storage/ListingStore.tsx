import React, { useReducer } from 'react'
// import AppStore, { AppStoreProps } from 'store/App/AppStore'
import { StoreActions, StoreReducer } from 'store/storeUtils/interfaces'
import storeReducerFactory from 'store/storeUtils/reducer'
import { StorageState, StorageListingPlan, StorageStoreProps } from './interfaces'
import { Modify } from 'utils/typeUtils'
import { StorageReducer, storageActions } from './storageReducer'

export type StoreName = 'storage_listing'

export type StorageListingState = Modify<StorageState, {
  plan: StorageListingPlan
}>

export const initialState: StorageListingState = {
  storeID: 'storage_listing',
  plan: {
    system: 'IPFS',
    availableSize: 1,
    country: '',
    currency: 'RIF',
    planItems: []
  }
}

const StorageListingStore = React.createContext({} as StorageStoreProps)
const listingReducer: StorageReducer | StoreReducer = storeReducerFactory(initialState, storageActions as unknown as StoreActions)

export const StorageListingStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(listingReducer, initialState)

  const value = { state, dispatch }
  return <StorageListingStore.Provider value={value}>{children}</StorageListingStore.Provider>
}

export default StorageListingStore