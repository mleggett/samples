import APP_CONTEXT from '../constants/appContext'
import { ITEM_DETAILS_ROUTE_IDENTIFIER } from './constants'
import jx from '../constants/jx'

export function itemListViewPath(itemId, projectId) {
  return `/items/${itemId}/list?projectId=${projectId}`
}

export function itemDetailsViewPath(itemId, projectId) {
  return `/items/${itemId}/${ITEM_DETAILS_ROUTE_IDENTIFIER}?projectId=${projectId}`
}

export function itemTreeFindMe(treeNodePath) {
  APP_CONTEXT.fireEvent('findItemTreeNode', {
    data: {
      item: {
        itemTreePath: treeNodePath,
      },
    },
  })
}

export function getItemIconClassNames(hasSignatures) {
  return hasSignatures ? 'j-item-signed-icon' : 'j-item-icon'
}

export function routeToItem(itemId, projectId) {
  const path = itemListViewPath(itemId, projectId)
  jx.hack.location.push(path)
}
