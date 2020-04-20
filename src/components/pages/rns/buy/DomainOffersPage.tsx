import { createOffersService, DOMAINS_SERVICE_PATHS, fetchDomainOffers } from 'api/rif-marketplace-cache/domainsController';
import CombinedPriceCell from 'components/molecules/CombinedPriceCell';
import SelectRowButton from 'components/molecules/table/SelectRowButton';
import DomainOfferFilters from 'components/organisms/filters/DomainOffersFilters';
import MarketPageTemplate from 'components/templates/MarketPageTemplate';
import { MarketListingTypes } from 'models/Market';
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { ROUTES } from 'routes';
import { MARKET_ACTIONS } from 'store/Market/marketActions';
import MarketStore, { TxType } from 'store/Market/MarketStore';

const LISTING_TYPE = MarketListingTypes.DOMAIN_OFFERS;
const TX_TYPE = TxType.BUY;

const DomainOffersPage = () => {
  const {
    state: {
      currentListing,
      filters: {
        domainOffers: offerFilters,
      },
    },
    dispatch,
  } = useContext(MarketStore);
  const history = useHistory()

  const servicePath = currentListing?.servicePath;

  /* Initialise */
  useEffect(() => {
    if (servicePath && servicePath !== DOMAINS_SERVICE_PATHS.BUY()) {
      dispatch({
        type: MARKET_ACTIONS.TOGGLE_TX_TYPE,
        payload: {
          txType: TxType.BUY
        }
      })
    }
  }, [servicePath, dispatch])

  useEffect(() => {
    if (!servicePath) {
      const serviceAddr = createOffersService();
      dispatch({
        type: MARKET_ACTIONS.CONNECT_SERVICE,
        payload: {
          servicePath: serviceAddr,
          listingType: LISTING_TYPE,
          txType: TX_TYPE,
        }
      })
    }
  }, [servicePath, dispatch])

  useEffect(() => {
    if (servicePath && servicePath === DOMAINS_SERVICE_PATHS.BUY())
      fetchDomainOffers(offerFilters)
        .then(items => dispatch({
          type: MARKET_ACTIONS.SET_ITEMS,
          payload: {
            listingType: LISTING_TYPE,
            items,
          },
        }));
  }, [offerFilters, servicePath, dispatch]);

  if (!currentListing) return null;

  const headers = {
    domainName: 'Name',
    sellerAddress: 'Seller',
    expirationDatetime: 'Renewal Date',
    combinedPrice: 'Price',
    actionCol_1: ''
  }

  const collection = currentListing?.items
    .map(domainItem => {
      const { _id, price, priceFiat, paymentToken, expirationDate } = domainItem;

      domainItem.combinedPrice = <CombinedPriceCell
        price={price}
        priceFiat={priceFiat}
        currency={paymentToken}
        currencyFiat='USD'
        divider=' = '
      />
      domainItem.actionCol_1 = <SelectRowButton
        id={_id}
        handleSelect={() => {
          dispatch({
            type: MARKET_ACTIONS.SELECT_ITEM,
            payload: {
              listingType: LISTING_TYPE,
              item: domainItem,
              txType: TX_TYPE
            }
          })
          history.push(ROUTES.DOMAINS.CHECKOUT.BUY)
        }}
      />;
      domainItem.expirationDatetime = (new Date(expirationDate)).toDateString()

      return domainItem;
    })

  return (
    <MarketPageTemplate
      className="Domain Offers"
      filterItems={<DomainOfferFilters />}
      itemCollection={collection}
      headers={headers}
    />
  );
};

export default DomainOffersPage;