import treeConstants from 'jama/constants/treeConstants'
import api from 'jama/api'
import { get } from 'lodash'
import {
  showExtError,
  showExtSuccess,
} from '../../../../helpers/rest/showExtAlert'
import {
  GENERIC_ERROR_TITLE,
  GENERIC_ERROR_MESSAGE,
} from '../../../../constants/messages/errors'

Ext.ns('plugin')

plugin.ItemTreeDndPlugin = Ext.extend(Ext.util.Observable, {
  panel: null,
  appContext: null,

  init(panel) {
    this.panel = panel
    this.appContext = this.panel.getAppContext()

    // events:
    // startdrag, nodedragover, beforenodedrop, nodedrop, dragdrop, beforedestroy
    this.panel.on({
      nodedragover: this.nodeDragOver,
      nodedrop: this.nodeDrop,
      beforedestroy: this.beforeDestroy,
      scope: this,
    })
  },

  nodeDragOver(e) {
    const nodeBeingMoved = e.dropNode
    const hoverTargetNode = e.target
    const movedNodeType = nodeBeingMoved.id.charAt(0)
    const movedNodeIsItemSource =
      movedNodeType === tree.TreeNodeType.ITEM_GROUP
    const movedNodeIsItemFolder =
      movedNodeType === tree.TreeNodeType.ITEM_FOLDER

    const targetNodeType = hoverTargetNode.id.charAt(0)
    const targetNodeIsItemSource =
      targetNodeType === tree.TreeNodeType.ITEM_GROUP
    const targetNodeIsItem =
      targetNodeType === tree.TreeNodeType.ITEM

    if (movedNodeIsItemSource || movedNodeIsItemFolder) {
      // item sources and folders can't be dropped into items
      if (targetNodeIsItem) {
        return false
      }
      // item sources can't be dropped into other sources
      if (
        targetNodeIsItemSource &&
        e.point === treeConstants.location.APPEND
      ) {
        return false
      }
    }

    return true
  },

  getSuccessMessage: function(e) {
    const movedNode = e.dropNode
    const movedNodeType = movedNode.id.charAt(0)
    const isSource = movedNodeType === tree.TreeNodeType.ITEM_GROUP
    const isFolder = movedNodeType === tree.TreeNodeType.ITEM_FOLDER
    const key = get(movedNode, 'attributes.key')
    const name = get(movedNode, 'attributes.text')
    let message = ''
    if (isFolder && key && name) {
      message = `Folder ${key} ${name} was moved`
    } else if (isSource && key && name) {
      message = `Source ${key} ${name} was moved`
    }
    return message
  },

  nodeDrop(e) {
    this.panel.loadMask.show('')
    const projectId = this.appContext.currentProject.id
    let insertAfter
    let parentNodeId = e.target.id
    let messageBody = this.getSuccessMessage(e)
    if (e.point === treeConstants.location.BELOW) {
      insertAfter = e.target.id
      parentNodeId = e.target.parentNode.id
    }
    if (e.point === treeConstants.location.ABOVE) {
      insertAfter = get(e, 'target.previousSibling.previousSibling.id')
      parentNodeId = e.target.parentNode.id
    }
    api.items
      .moveItem(projectId, e.dropNode.id, parentNodeId, insertAfter)
      .then(
        response => {
          showExtSuccess(
            'Success',
            messageBody,
            5,
            this.undo.bind(this, response.data)
          )
        },
        error => {
          const message = get(
            error,
            'responseJSON.meta.message',
            error.responseText
          )
          const userMessage = get(
            error,
            'responseJSON.meta.userMessage',
            undefined
          )
          this.panel.refreshView()
          if (userMessage) {
            showExtError('Cannot complete move', userMessage)
          } else {
            showExtError(GENERIC_ERROR_TITLE, GENERIC_ERROR_MESSAGE)
          }
          console.error('Error', message)
        }
      )
      .finally(() => {
        this.panel.loadMask.hide()
      })
  },

  undo(params) {
    const projectId = this.appContext.currentProject.id
    const dropNodeId = params.nodeId
    const parentNodeId = params.targetParentNodeId
    const insertAfter = params.insertAfterNodeId
    api.items
      .moveItem(projectId, dropNodeId, parentNodeId, insertAfter)
      .then(
        () => this.panel.refreshView(),
        () => this.panel.refreshView()
      )
  },

  beforeDestroy() {
    this.purgeListeners()
  },
})
