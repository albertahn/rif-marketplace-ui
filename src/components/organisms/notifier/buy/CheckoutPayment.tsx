import RoundBtn from 'components/atoms/RoundBtn'
import React, { FC, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import GridRow from 'components/atoms/GridRow'
import GridItem from 'components/atoms/GridItem'
import Grid from '@material-ui/core/Grid'
import { SupportedTokenSymbol } from 'models/Token'
import CurrencySelect from 'components/molecules/CurrencySelect'
import { SYSTEM_SUPPORTED_FIAT } from 'models/Fiat'
import { MarketCryptoRecord, QuotationPerToken } from 'models/Market'
import ExpirationDate from 'components/molecules/ExpirationDate'
import PriceSummary from 'components/molecules/PriceSummary'
import { makeStyles, Theme } from '@material-ui/core'
import RoundedCard from 'components/atoms/RoundedCard'

type Props = {
  onBuy: () => void
  paymentOptions: QuotationPerToken
  fiatUnit: SYSTEM_SUPPORTED_FIAT
  expirationDate: Date
  cryptoXRs: MarketCryptoRecord
}

const useStyles = makeStyles((theme: Theme) => ({
  priceSummaryCard: {
    padding: theme.spacing(1.5, 3),
    marginBottom: theme.spacing(1),
  },
  expirationDate: {
    justifyContent: 'center',
  },
}))

const CheckoutPayment: FC<Props> = ({
  onBuy, paymentOptions, fiatUnit, expirationDate, cryptoXRs,
}) => {
  const classes = useStyles()

  const currencyOptions = Object.keys(paymentOptions) as SupportedTokenSymbol[]
  const [selectedCurrency, setSelectedCurrency] = useState(currencyOptions[0])

  const handleCurrencyChange = (
    { target: { value } }: React.ChangeEvent<{ name?: string, value: unknown }>,
  ): void => {
    setSelectedCurrency(value as SupportedTokenSymbol)
  }

  return (
    <>
      <GridRow>
        <GridItem md={4} sm={12}>
          <p>Select currency</p>
          <GridItem xs={12}>
            <CurrencySelect
              options={currencyOptions}
              value={selectedCurrency}
              onChange={handleCurrencyChange}
            />
          </GridItem>
        </GridItem>
        <GridItem md={4} sm={12}>
          <GridRow justify="center">
            <RoundedCard className={classes.priceSummaryCard} color="primary">
              <PriceSummary
                cryptoPrice={paymentOptions[selectedCurrency]}
                cryptoXRs={cryptoXRs}
                currency={selectedCurrency}
                fiatUnit={fiatUnit}
              />
            </RoundedCard>
            <GridRow justify="center">
              <Typography color="secondary" align="center">Expiration date</Typography>
              <ExpirationDate
                className={classes.expirationDate}
                type="normal"
                date={expirationDate}
              />
            </GridRow>
          </GridRow>
        </GridItem>
        <Grid container item md={4} sm={12} justify="center">
          <RoundBtn onClick={onBuy}>Buy</RoundBtn>
          <Typography
            color="secondary"
            variant="subtitle1"
            align="center"
          >
            {`Your wallet will open and you will be asked
               to confirm the transaction for buying the notification plan.`}
          </Typography>
        </Grid>
      </GridRow>
    </>
  )
}

export default CheckoutPayment