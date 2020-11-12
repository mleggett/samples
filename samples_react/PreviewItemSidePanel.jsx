import React, { Component } from 'react'
import SidePanel from '../components/sidepanel/SidePanel'
import SidePanelContent from '../coverage/components/side-panel/SidePanelContent'
import InternalLink from '../coverage/components/InternalLink'
import Spinner from '../components/spinner/Spinner'
import IconButton from '../components/button/IconButton'
import icons from '../components/icons'
import { showExtError } from '../helpers/rest/showExtAlert'
import { ITEM_DELETED_DISPLAY_MESSAGE } from '../components/readinggrid/constants'
import { GENERIC_ERROR_TITLE } from '../constants/messages/errors'
import APP_CONTEXT from '../constants/appContext'
import userItemSvc from '../constants/dwr/userItemSvc'
import { get, isEmpty } from 'lodash'
import './PreviewItemSidePanel.scss'

export default class PreviewItemSidePanel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      versionOfItem: {},
    }
  }

  getSelectedItemChanged(id, version) {
    if (!version) {
      const loadedItemId = get(this.state, 'versionOfItem.id')
      return id !== loadedItemId
    } else {
      const loadedCurrentVersionId = get(
        this.state,
        'versionOfItem.currentVersionDocumentId'
      )
      const loadedVersionNumber = get(
        this.state,
        'versionOfItem.versionNumber'
      )
      return (
        id !== loadedCurrentVersionId &&
        version !== loadedVersionNumber
      )
    }
  }

  renderSidePanelContent(id, version, closeSidePanel) {
    let shouldLoadDocument = false
    const documentNotLoaded = isEmpty(this.state.versionOfItem)
    const selectedItemChanged = this.getSelectedItemChanged(id, version)

    if (documentNotLoaded || selectedItemChanged) {
      shouldLoadDocument = true
    }

    if (shouldLoadDocument) {
      this.getversionOfItem(id, version, closeSidePanel)
      return <Spinner inline={true} visible={true} />
    }

    const item = this.state.versionOfItem
    const { name, project, globalId, description } = item

    return (
      <SidePanelContent
        projectName={project.name}
        projectId={project.id}
        globalId={globalId}
        name={name}
        description={description}
        item={item}
      />
    )
  }

  getversionOfItem(id, version, closeSidePanel) {
    // Version is optional
    // If omitted, you must use a versioned item id.
    // If included, you must use the current version item id.
    userItemSvc.getuserItemVersionDto(id, version, {
      callback: item => {
        this.setState({ versionOfItem: item })
      },
      errorHandler: () => {
        showExtError(GENERIC_ERROR_TITLE, 'Could not load version')
        closeSidePanel()
      },
    })
  }

  getSidePanelHeader(selectedItem, closeSidePanel) {
    let item = selectedItem
    const { CloseIcon } = icons

    if (!item.name) {
      item = this.state.versionOfItem
    }

    if (!item.name) {
      return (
        <header
          className="header-container"
          data-automation="tem-preview-header"
        >
          <div className="discovery-toolbar">
            <IconButton
              onClick={closeSidePanel}
              className="close-side-panel-button"
              data-automation="sidebar-close-button"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </header>
      )
    }

    const {
      name,
      documentKey,
      documentVersionNumber,
      currentVersionNumber,
      currentVersionDocumentActive,
      currentVersionDocumentId,
      documentType,
      project,
    } = item
    const { image, display } = documentType
    const imageLocation = `img/tree/${image}`
    const currentVersion = currentVersionDocumentActive
      ? currentVersionNumber
      : ITEM_DELETED_DISPLAY_MESSAGE
    const versionText = `Version ${documentVersionNumber} of ${currentVersion}`
    const tooltipMessage = currentVersionDocumentActive
      ? 'View current version'
      : 'This item has been deleted'

    return (
      <header
        className="header-container"
        data-automation="item-preview-header"
      >
        <div className="discovery-toolbar">
          <span className="sr-label with-tooltip" aria-label={tooltipMessage}>
            <InternalLink
              onOpenItemTab={() => {
                this.openCurrentVersionOfItem(currentVersionDocumentId, project)
              }}
              linkText={documentKey}
              projectId={project.id}
              itemId={currentVersionDocumentId}
              openCoverageSidePanel={false}
              dataAutomation="view-current-version-link"
              disabled={!currentVersionDocumentActive}
            />
          </span>
          <IconButton
            onClick={closeSidePanel}
            className="close-side-panel-button"
            data-automation="sidebar-close-button"
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div
          className="main-toolbar"
          data-automation="item-preview-header-item-name"
        >
          <h3>{name}</h3>
        </div>
        <div className="secondary-toolbar">
          <img
            src={imageLocation}
            className="sidepanel-icon-image"
            alt={display}
            data-automation="icon-image"
          />
          <span data-automation="display-type">{display}</span>
          <span className="dot-divider" />
          <span
            className="sidepanel-version"
            data-automation="sidepanel-version"
          >
            {versionText}
          </span>
        </div>
      </header>
    )
  }

  openCurrentVersionOfItem(currentVersionDocumentId, project) {
    userItemSvc.getuserItemDto(currentVersionDocumentId, {
      callback: item => {
        APP_CONTEXT.fireEvent('showItem', {
          data: {
            project: project,
            item,
          },
        })
      },
      errorHandler: () => {
        showExtError(GENERIC_ERROR_TITLE, 'Could not load current version')
      },
    })
  }

  render() {
    const { selectedItem, closeSidePanel, maxWidth } = this.props
    const { id, version } = selectedItem

    return (
      <SidePanel
        headerComponent={this.getSidePanelHeader(selectedItem, closeSidePanel)}
        className="side-panel"
        resizeId="previewItemSidePanel"
        maxWidth={maxWidth}
      >
        {this.renderSidePanelContent(id, version, closeSidePanel)}
      </SidePanel>
    )
  }
}
