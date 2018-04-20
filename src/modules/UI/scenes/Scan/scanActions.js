// @flow

import { Clipboard } from 'react-native'
import { Actions } from 'react-native-router-flux'
import type { EdgeParsedUri } from 'edge-core-js'

import type { Dispatch, GetState } from '../../../ReduxTypes.js'
import * as WALLET_API from '../../../Core/Wallets/api.js'
import * as UTILS from '../../../utils.js'
import { loginWithEdge } from '../../../../actions/EdgeLoginActions.js'
import { updateParsedURI } from '../../scenes/SendConfirmation/action.js'
import { qrCodeScanned, torchToggled } from './Camera/CameraActions.js'
import { activated as addressModalActivated } from './AddressModal/AddressModalActions.js'

export const PREFIX = 'SCAN/'

// SCENE ////////////////////////////////////////////////////////////////
export const SCENE_ENTERED = PREFIX + 'SCENE_ENTERED'
export const sceneEntered = () => ({
  type: SCENE_ENTERED
})

export const SCENE_EXITED = PREFIX + 'SCENE_EXITED'
export const sceneExited = () => ({
  type: SCENE_EXITED
})

// INVALID_URI_MODAL /////////////////////////////////////////////////////////
export const INVALID_URI_MODAL_ACTIVATED = PREFIX + 'INVALID_URI_MODAL_ACTIVATED'
export const invalidUriModalActivated = () => ({
  type: INVALID_URI_MODAL_ACTIVATED
})

export const INVALID_URI_MODAL_DEACTIVATED = PREFIX + 'INVALID_URI_MODAL_DEACTIVATED'
export const invalidUriModalDeactivated = () => ({
  type: INVALID_URI_MODAL_DEACTIVATED
})

export const INVALID_URI_MODAL_TOGGLED = PREFIX + 'INVALID_URI_MODAL_TOGGLED'
export const invalidUriModalToggled = () => ({
  type: INVALID_URI_MODAL_TOGGLED
})

export const INVALID_URI_MODAL_DEPLOYED = PREFIX + 'INVALID_URI_MODAL_DEPLOYED'
export const invalidUriModalDeployed = () => ({
  type: INVALID_URI_MODAL_DEPLOYED
})

export const INVALID_URI_MODAL_HIDDEN = PREFIX + 'INVALID_URI_MODAL_HIDDEN'
export const invalidUriModalHidden = () => ({
  type: INVALID_URI_MODAL_HIDDEN
})

export const INVALID_URI_MODAL_BACKDROP_PRESSED = PREFIX + 'INVALID_URI_MODAL_BACKDROP_PRESSED'
export const invalidUriModalBackdropPressed = () => ({
  type: INVALID_URI_MODAL_BACKDROP_PRESSED
})

export const INVALID_URI_MODAL_BACK_BUTTON_PRESSED = PREFIX + 'INVALID_URI_MODAL_BACK_BUTTON_PRESSED'
export const invalidUriModalBackButtonPressed = () => ({
  type: INVALID_URI_MODAL_BACK_BUTTON_PRESSED
})

export const INVALID_URI_MODAL_EXPIRED = PREFIX + 'INVALID_URI_MODAL_EXPIRED'
export const invalidUriModalExpired = () => ({
  type: INVALID_URI_MODAL_EXPIRED
})

// PARSE ////////////////////////////////////////////////////////////////
export const PARSE_URI_SUCCEEDED = PREFIX + 'PARSE_URI_SUCCEEDED'
export const parseUriSuceeded = (parsedUri: EdgeParsedUri) => ({
  type: PARSE_URI_SUCCEEDED,
  data: { parsedUri }
})

export const PARSE_URI_FAILED = PREFIX + 'PARSE_URI_FAILED'
export const parseUriFailed = (error: Error) => ({
  type: PARSE_URI_FAILED,
  data: { error }
})

// LEGACY_ADDRESS ////////////////////////////////////////////////////////////////
export const LEGACY_ADDRESS_DETECTED = PREFIX + 'LEGACY_ADDRESS_DETECTED'
export const legacyAddressDetected = (parsedUri: EdgeParsedUri) => ({
  type: LEGACY_ADDRESS_DETECTED,
  data: { parsedUri }
})

// EDGE_LOGIN ////////////////////////////////////////////////////////////////
export const EDGE_LOGIN_DETECTED = PREFIX + 'EDGE_LOGIN_DETECTED'
export const edgeLoginDetected = (uri: string) => ({
  type: EDGE_LOGIN_DETECTED,
  data: { uri }
})

// TOKEN ////////////////////////////////////////////////////////////////
export const TOKEN_DETECTED = PREFIX + 'TOKEN_DETECTED'
export const tokenDetected = (parameters: {}) => ({
  type: TOKEN_DETECTED,
  data: { parameters }
})

// PUBLIC_ADDRESS ////////////////////////////////////////////////////////////////
export const PUBLIC_ADDRESS_DETECTED = PREFIX + 'PUBLIC_ADDRESS_DETECTED'
export const publicAddressDetected = (parsedUri: EdgeParsedUri) => ({
  type: PUBLIC_ADDRESS_DETECTED,
  data: { parsedUri }
})

// OPERATIONS ////////////////////////////////////////////////////////////////
export const dataSubmitted = (data: string) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  if (!state.ui.scenes.scan.scanEnabled) return

  dispatch(qrCodeScanned(data))

  // EDGE LOGIN ///////////////////////////////////////////////////////////
  if (UTILS.isEdgeLogin(data)) {
    dispatch(edgeLoginDetected(data))
    dispatch(loginWithEdge(data))
    return
  }

  const edgeWallet = state.core.wallets.byId[state.ui.wallets.selectedWalletId]
  let parsedUri
  try {
    parsedUri = WALLET_API.parseURI(edgeWallet, data)
  } catch (error) {
    // INVALID QRCODE ///////////////////////////////////////////////////////
    dispatch(parseUriFailed(error))
    return
  }
  // TOKEN ////////////////////////////////////////////////////////////////
  if (parsedUri.token) {
    // token URI, not pay
    const { contractAddress, currencyName, multiplier } = parsedUri.token
    const currencyCode = parsedUri.token.currencyCode.toUpperCase()
    const walletId = state.ui.wallets.selectedWalletId
    const wallet = state.ui.wallets.byId[walletId]
    let decimalPlaces = 18
    if (parsedUri.token && parsedUri.token.multiplier) {
      decimalPlaces = UTILS.denominationToDecimalPlaces(parsedUri.token.multiplier)
    }
    const parameters = {
      contractAddress,
      currencyCode,
      currencyName,
      multiplier,
      decimalPlaces,
      walletId,
      wallet,
      onAddToken: UTILS.noOp
    }

    dispatch(tokenDetected(parameters))
    Actions.addToken(parameters)
    return
  }

  // LEGACY ADDRESS ///////////////////////////////////////////////////////
  if (parsedUri.legacyAddress) {
    dispatch(legacyAddressDetected(parsedUri))
    return
  }

  // PUBLIC ADDRESS ///////////////////////////////////////////////////////
  dispatch(publicAddressDetected(parsedUri))
  dispatch(updateParsedURI(parsedUri))
  Actions.sendConfirmation('fromScan')
}

// ADDRESS_BUTTON ///////////////////////////////////////////////////////
export const addressButtonPressed = () => (dispatch: Dispatch) => {
  // return dispatch(addressModalActivated(''))
  return Clipboard.getString().then(input => {
    return dispatch(addressModalActivated(input))
  })
}

// TORCH_BUTTON ///////////////////////////////////////////////////////
export const torchButtonPressed = () => (dispatch: Dispatch) => {
  dispatch(torchToggled())
}

// SCAN
export { scanEnabled, scanDisabled } from './Camera/CameraActions.js'