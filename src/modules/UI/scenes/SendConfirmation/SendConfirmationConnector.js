// @flow

import { bns } from 'biggystring'
import { connect } from 'react-redux'

import { getCurrencyConverter, getExchangeRate } from '../../../Core/selectors.js'
import type { Dispatch, State } from '../../../ReduxTypes'
import { convertNativeToExchange } from '../../../utils'
import { getExchangeDenomination, getSelectedCurrencyCode, getSelectedWallet } from '../../selectors.js'
import { getDisplayDenomination, getExchangeDenomination as settingsGetExchangeDenomination } from '../../Settings/selectors.js'
import { reset, signBroadcastAndSave, updateAmount, updateSpendPending } from './action.js'
import {
  getError,
  getForceUpdateGuiCounter,
  getKeyboardIsVisible,
  getLabel,
  getNativeAmount,
  getNetworkFee,
  getParentNetworkFee,
  getPending,
  getPublicAddress,
  getTransaction
} from './selectors'
import { SendConfirmation } from './SendConfirmation.ui'
import type { SendConfirmationDispatchProps, SendConfirmationStateProps } from './SendConfirmation.ui'

const mapStateToProps = (state: State): SendConfirmationStateProps => {
  let fiatPerCrypto = 0
  let secondaryeExchangeCurrencyCode = ''
  const currencyConverter = getCurrencyConverter(state)
  const guiWallet = getSelectedWallet(state)
  const currencyCode = getSelectedCurrencyCode(state)
  const balanceInCrypto = guiWallet.nativeBalances[currencyCode]

  const isoFiatCurrencyCode = guiWallet.isoFiatCurrencyCode
  const exchangeDenomination = settingsGetExchangeDenomination(state, currencyCode)
  // $FlowFixMe
  const balanceInCryptoExchange = convertNativeToExchange(exchangeDenomination.multiplier)(balanceInCrypto)
  const balanceInFiat = currencyConverter.convertCurrency(currencyCode, isoFiatCurrencyCode, balanceInCryptoExchange)

  if (guiWallet) {
    const isoFiatCurrencyCode = guiWallet.isoFiatCurrencyCode
    fiatPerCrypto = getExchangeRate(state, currencyCode, isoFiatCurrencyCode)
    secondaryeExchangeCurrencyCode = isoFiatCurrencyCode
  }

  const transaction = getTransaction(state)
  const pending = getPending(state)
  const nativeAmount = getNativeAmount(state)
  let error = getError(state)

  let errorMsg = null
  let resetSlider = false
  if (error && error.message === 'broadcastError') {
    error = null
    resetSlider = true
  }
  if (error && nativeAmount && bns.gt(nativeAmount, '0')) {
    errorMsg = error.message
  }

  const out = {
    balanceInCrypto,
    balanceInFiat,
    currencyCode,
    currencyConverter,
    errorMsg,
    fiatCurrencyCode: guiWallet.fiatCurrencyCode,
    fiatPerCrypto,
    forceUpdateGuiCounter: getForceUpdateGuiCounter(state),
    keyboardIsVisible: getKeyboardIsVisible(state),
    label: getLabel(state),
    nativeAmount,
    networkFee: getNetworkFee(state),
    parentDisplayDenomination: getDisplayDenomination(state, guiWallet.currencyCode),
    parentExchangeDenomination: getExchangeDenomination(state, guiWallet.currencyCode),
    parentNetworkFee: getParentNetworkFee(state),
    pending,
    primaryDisplayDenomination: getDisplayDenomination(state, currencyCode),
    primaryExchangeDenomination: getExchangeDenomination(state, currencyCode),
    publicAddress: getPublicAddress(state),
    resetSlider,
    secondaryeExchangeCurrencyCode,
    sliderDisabled: !transaction || !!error || !!pending
  }
  return out
}

const mapDispatchToProps = (dispatch: Dispatch): SendConfirmationDispatchProps => ({
  updateAmount: (nativeAmount: string, exchangeAmount: string, fiatPerCrypto: string) => dispatch(updateAmount(nativeAmount, exchangeAmount, fiatPerCrypto)),
  reset: () => dispatch(reset()),
  updateSpendPending: (pending: boolean): any => dispatch(updateSpendPending(pending)),
  signBroadcastAndSave: (): any => dispatch(signBroadcastAndSave())
})

export default connect(mapStateToProps, mapDispatchToProps)(SendConfirmation)
