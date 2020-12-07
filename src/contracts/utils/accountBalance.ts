import Big, { BigSource } from 'big.js'
import {
  SupportedTokens, SUPPORTED_TOKENS,
} from 'contracts/interfaces'
import CustomError from 'models/CustomError'
import getToken from 'utils/tokenUtils'
import Web3 from 'web3'

export const getBalance = (
  web3: Web3,
  account: string,
  tokenName: SupportedTokens,
): Promise<string> => {
  const tokenObject = getToken(tokenName)

  if (tokenObject.token === SUPPORTED_TOKENS.rbtc) { // native token
    return web3.eth.getBalance(account)
  }

  const { tokenContract } = tokenObject
  return tokenContract.getInstance(web3)
    .methods.balanceOf(account).call()
}

export const validateBalance = async (
  {
    web3, minAmountWei, account, token,
  }: {
    web3: Web3
    minAmountWei: BigSource
    account?: string
    token?: SUPPORTED_TOKENS
  },
): Promise<void> => {
  if (!account) throw new CustomError('Account is required.')

  if (!token) throw new CustomError('The token is required.')

  const balance = await getBalance(web3, account, token)

  if (Big(balance).lt(minAmountWei)) throw new CustomError('Not enough funds.')
}