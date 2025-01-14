import React from 'react'
import { CombinedPriceCell } from 'components/molecules'
import MarketplaceActionsCell from 'components/molecules/MarketplaceActionsCell'
import NotificationsBalance from 'components/molecules/notifier/NotificationsBalance'
import { MySubscription } from 'components/organisms/notifier/mypurchase/PurchasesTable'
import { NotifierSubscriptionItem } from 'models/marketItems/NotifierItem'
import { ExchangeRate } from 'context/Market/interfaces'
import MarketplaceAddressCell from 'components/molecules/MarketplaceAddressCell'
import ExpirationDate, { SubscriptionExpirationType } from 'components/molecules/ExpirationDate'
import { PlanDTO } from 'api/rif-marketplace-cache/notifier/offers/models'
import { logNotImplemented } from 'utils/utils'

const EXPIRATION_WARNING_TRIGGER = 5

const getExpirationType = (
  { planStatus, daysLeft }: PlanDTO,
): SubscriptionExpirationType => {
  if (planStatus === 'INACTIVE' || daysLeft <= 0) return 'blocked'

  if (daysLeft <= EXPIRATION_WARNING_TRIGGER) return 'warning'

  return 'normal'
}

const mapMyPurchases = ({
  currentFiat,
  crypto,
}: ExchangeRate) => ({
  id,
  token,
  provider,
  plan,
  notificationBalance,
  expirationDate,
  price,
}: NotifierSubscriptionItem):
  MySubscription => {
  const { rate, displayName } = crypto?.[token.symbol]
    || { rate: 0, displayName: '' }

  const expType = getExpirationType(plan)

  return {
    id,
    subId: <MarketplaceAddressCell value={id} />,
    provider: <MarketplaceAddressCell value={provider} />,
    notifications: (
      <NotificationsBalance
        balance={notificationBalance}
        limit={plan.quantity}
      />
    ),
    expirationDate: (
      <ExpirationDate
        date={expirationDate}
        type={expType}
      />
    ),
    price: <CombinedPriceCell
      disabled={expType === 'blocked'}
      price={price.toString()}
      priceFiat={price.times(rate).toString()}
      currency={displayName}
      currencyFiat={currentFiat.displayName}
      divider=""
    />,
    actions: (
      <MarketplaceActionsCell
        actions={[
          {
            disabled: expType === 'blocked',
            id: `renew_${id}`,
            handleSelect: logNotImplemented('handle renew'),
            children: 'Renew',
          }, {
            id: `view_${id}`,
            handleSelect: logNotImplemented('handle view'),
            children: 'View',
          },
        ]}
      />
    ),
  }
}

export default mapMyPurchases
