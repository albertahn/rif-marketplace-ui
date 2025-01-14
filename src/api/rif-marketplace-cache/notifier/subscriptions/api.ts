import { Paginated } from '@feathersjs/feathers'
import { AbstractAPIService, isResultPaginated } from 'api/models/apiService'
import client from 'api/rif-marketplace-cache/client'
import { SupportedFiatSymbol } from 'models/Fiat'
import { MinMaxFilter } from 'models/Filters'
import { NotifierSubscriptionsFilters } from 'models/marketItems/NotifierFilters'
import { NotifierSubscriptionItem } from 'models/marketItems/NotifierItem'
import { SupportedTokenSymbol } from 'models/Token'
import { parseToBigDecimal } from 'utils/parsers'
import { getSupportedTokenByName } from 'utils/tokenUtils'
import { NotifierAPIService } from '../interfaces'
import { SubscriptionDTO } from './models'

export const address = 'notifier/v0/subscriptions' as const
export type Address = typeof address

export const wsChannel = 'notifier_subscriptions' as const
export type WSChannel = typeof wsChannel

export const mapFromTransport = ({
  hash,
  expirationDate,
  price,
  rateId,
  providerId,
  ...subscription
}: SubscriptionDTO): NotifierSubscriptionItem => ({
  id: hash,
  expirationDate: new Date(expirationDate),
  price: parseToBigDecimal(price),
  token: getSupportedTokenByName(rateId as SupportedTokenSymbol),
  provider: providerId,
  ...subscription,
})

class SubscriptionsService extends AbstractAPIService
  implements NotifierAPIService {
  path = address

  constructor() {
    super(client)
  }

  _channel = wsChannel

  _fetch = async (
    filters: NotifierSubscriptionsFilters,
  ): Promise<NotifierSubscriptionItem[]> => {
    const result: Paginated<SubscriptionDTO> = await this.service.find({
      query: filters && {
        ...filters,
      },
    })

    const { data, ...metadata } = isResultPaginated(result)
      ? result : { data: result }
    this.meta = metadata

    return data.map(mapFromTransport)
  }

  findLimits({ fiatSymbol }: {
    fiatSymbol: SupportedFiatSymbol
  }): Promise<MinMaxFilter> {
    return this.service.find({
      query: {
        limits: {
          price: { fiatSymbol },
          size: true,
        },
      },
    })
  }
}

export default SubscriptionsService
