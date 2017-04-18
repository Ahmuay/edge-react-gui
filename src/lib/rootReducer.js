import { combineReducers } from 'redux'
import routes from './routesReducer'

import * as SideMenu from '../modules/SideMenu/SideMenu.reducer'
import * as Transactions from '../modules/Transactions/Transactions.reducer'
import * as Scan from '../modules/Scan/Scan.reducer'

const store = combineReducers({

  sidemenu: combineReducers({
    view  : SideMenu.view
  }),

  transactions: combineReducers({
    transactionsList: Transactions.transactionsList,
    searchVisible: Transactions.searchVisible,
    contactsList: Transactions.contactsList
  }),

  scan: combineReducers({
    torchEnabled: Scan.torchEnabled,
    addressModalVisible: Scan.addressModalVisible
  }),

  routes
})

export default store
