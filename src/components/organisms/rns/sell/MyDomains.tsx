import { Web3Store } from '@rsksmart/rif-ui'
import { createService } from 'api/rif-marketplace-cache/cacheController'
import { fetchDomains, RnsServicePaths } from 'api/rif-marketplace-cache/domainsController'
import { AddressItem, SelectRowButton } from 'components/molecules'
import DomainFilters from 'components/organisms/filters/DomainFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { MarketListingTypes } from 'models/Market'
import { Domain } from 'models/marketItems/DomainItem'
import React, { FC, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import MarketStore, { TxType } from 'store/Market/MarketStore'

const LISTING_TYPE = MarketListingTypes.DOMAINS

const MyDomains: FC<{}> = () => {
  const {
    state: {
      currentListing,
      filters: {
        domains: domainFilters,
      },
    },
    dispatch,
  } = useContext(MarketStore)
  const {
    state: { account },
  } = useContext(Web3Store)
  const history = useHistory()

  const servicePath = currentListing?.servicePath
  const listingType = currentListing?.listingType
  const items = currentListing?.items
  const { ownerAddress } = domainFilters

  // connect service
  useEffect(() => {
    if (account && servicePath !== RnsServicePaths.SELL) {
      const serviceAddr = createService(RnsServicePaths.SELL, dispatch)
      dispatch({
        type: MARKET_ACTIONS.CONNECT_SERVICE,
        payload: {
          servicePath: serviceAddr,
          listingType: MarketListingTypes.DOMAINS,
          txType: TxType.SELL,
        },
      })
    }
  }, [account, dispatch, servicePath])

  // fetch domains based on the statusFilter
  useEffect(() => {
    if (ownerAddress && servicePath === RnsServicePaths.SELL) {
      fetchDomains(domainFilters)
        .then((receivedItems) => dispatch({
          type: MARKET_ACTIONS.SET_ITEMS,
          payload: {
            listingType: MarketListingTypes.DOMAINS,
            items: receivedItems,
          },
        }))
    }
  }, [account, dispatch, domainFilters, ownerAddress, servicePath])

  useEffect(() => {
    if (account) {
      dispatch({
        type: MARKET_ACTIONS.SET_FILTER,
        payload: {
          filterItems: {
            ownerAddress: account,
          },
        },
      })
    }
  }, [account, dispatch])

  const headers = {
    name: 'Name',
    expirationDate: 'Renewal Date',
    action1: '',
  }

  if (!currentListing || listingType !== LISTING_TYPE) return null

  const collection = items
    .map((domainItem: Domain) => {
      const {
        id,
        name,
        expirationDate,
        tokenId,
      } = domainItem

      const pseudoResolvedName = domainFilters?.name?.$like && (`${domainFilters?.name?.$like}.rsk`)
      const displayItem = {
        id,
        name: name || pseudoResolvedName || <AddressItem pretext="Unknown RNS:" value={tokenId} />,
        expirationDate: expirationDate.toLocaleDateString(),
        action1: <SelectRowButton
          id={id}
          handleSelect={() => {
            dispatch({
              type: MARKET_ACTIONS.SELECT_ITEM,
              payload: {
                listingType: LISTING_TYPE,
                item: domainItem,
                txType: TxType.SELL,
              },
            })
            history.push(ROUTES.DOMAINS.CHECKOUT.SELL)
          }}
        />,
        price: <></>,
        action2: <></>,
      }
      return displayItem
    })

  return (
    <MarketPageTemplate
      filterItems={<DomainFilters />}
      itemCollection={collection}
      headers={headers}
      accountRequired
    />
  )
}

export default MyDomains
