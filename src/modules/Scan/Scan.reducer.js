import * as ACTION from './Scan.action'

export const torchEnabled = (state = false, action) => {
  switch (action.type) {
    case ACTION.TOGGLE_ENABLE_TORCH :
      return !state
    default:
      return state
  }
}

export const addressModalVisible = (state = false, action) => {
  switch (action.type) {
    case ACTION.TOGGLE_ADDRESS_MODAL_VISIBILITY:
      return !state
    default:
      return state
  }
}
