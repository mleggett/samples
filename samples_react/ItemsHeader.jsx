import React, { Component, Fragment } from 'react'
import { get } from 'lodash'
import ItemsViewHeaderTitle from '../items/ItemsViewHeaderTitle'
import ItemSelectionCount from '../items/ItemSelectionCount'
import ItemCompareWithCurrentButton from './ItemCompareWithCurrentButton'
import ColumnTogglerController from '../items/ColumnTogglerController'
import ItemsViewHeaderToggleButtonsContainer from '../items/ItemsViewHeaderToggleButtonsContainer'
import ItemsViewFieldTogglerContainer from '../items/containers/ItemsViewFieldTogglerContainer'
import EditButton from '../kit/button/EditButton'
import ReloadButton from '../kit/button/ReloadButton'
import FIELD_LAYOUT_TYPE from '../constants/FieldLayoutType'
import { getItemIconClassNames } from './utils'
import ItemDeleteController from './ItemDeleteController'
import ItemReviewLink from './ItemReviewLink'
import ReplaceWithItemController from './ReplaceWithItemController'
import MenuDivider from '../kit/dividers/MenuDivider'
import ItemPreviewItemButton from './ItemPreviewItemButton'
import ExportMenu from '../items/menu/ExportMenu'
import './ItemsHeader.scss'

export default class ItemsHeader extends Component {
  getReplaceWithItemButton() {
    const { id, canRevertItemsToItemVersion } = this.props.data.item

    if (canRevertItemsToItemVersion) {
      return <ReplaceWithItemController itemId={id} />
    }
  }

  getCompareAndPreviewButtons(atLeastOneItemSelected) {
    const { selectedItem, data, showItemPreviewItem } = this.props
    const item = data.item

    if (atLeastOneItemSelected) {
      return (
        <Fragment>
          <ItemCompareWithCurrentButton
            selectedItem={selectedItem}
            itemId={item.id}
          />
          <ItemPreviewItemButton
            showItemPreviewItem={showItemPreviewItem}
          />
        </Fragment>
      )
    }
  }

  getFieldTogglerComponent(
    isTogglerDisabled,
    currentLayout,
    parentContainer,
    ExtContainer,
    columns,
    onToggleColumn,
    isReadingView,
    componentId
  ) {
    let fieldLayout
    if (isReadingView) {
      fieldLayout = FIELD_LAYOUT_TYPE.ITEM_READING.code
      return (
        <ItemsViewFieldTogglerContainer
          disabled={isTogglerDisabled}
          componentId={componentId}
          currentLayout={currentLayout}
          parentContainer={parentContainer}
          ExtContainer={ExtContainer}
          fieldLayout={fieldLayout}
        />
      )
    } else {
      fieldLayout = FIELD_LAYOUT_TYPE.ITEM_LIST.code
      return (
        <ColumnTogglerController
          disabled={isTogglerDisabled}
          currentLayout={currentLayout}
          parentContainer={parentContainer}
          ExtContainer={ExtContainer}
          columns={columns}
          onToggleColumn={onToggleColumn}
          fieldLayout={fieldLayout}
          className=""
        />
      )
    }
  }

  render() {
    const {
      headingId,
      data,
      viewTitle,
      selectedCount,
      totalItemCount,
      onChangeLayout,
      projectId,
      componentId,
      currentLayout,
      parentContainer,
      ExtContainer,
      columns,
      onToggleColumn,
      routeToItemDetailsView,
      handleFindMe,
      selectedItem,
      onRefresh,
      viewContext,
      checkItemTypeMap,
      visibleColumnsFieldList,
    } = this.props

    const isReadingView = currentLayout === FIELD_LAYOUT_TYPE.READING.code
    const isListView = currentLayout === FIELD_LAYOUT_TYPE.LIST.code
    const fieldConfig = isListView
      ? FIELD_LAYOUT_TYPE.ITEM_LIST.code
      : FIELD_LAYOUT_TYPE.ITEM_READING.code
    const showFieldToggler = isListView || isReadingView
    const isTogglerDisabled = totalItemCount === 0
    const { item } = data
    const itemId = item.id
    const itemKey = item.key
    const itemName = item.name
    const { treeNodePath, canBeDeleted, canBeModified } = item

    const isSigned = get(data, 'isSigned', false)
    const iconClass = getItemIconClassNames(isSigned)
    const modifyDisabled = !canBeModified
    const cannotEditMessage = canBeModified ? '' : 'Permission needed to edit'
    const atLeastOneItemSelected = !!selectedItem

    const FieldTogglerComponent = this.getFieldTogglerComponent(
      isTogglerDisabled,
      currentLayout,
      parentContainer,
      ExtContainer,
      columns,
      onToggleColumn,
      isReadingView,
      componentId
    )

    return (
      <header
        className="content-header items-header"
        data-automation="items-header"
      >
        <div className="discovery-toolbar">
          <div className="views-column">
            <span className="breadcrumbs" data-automation="breadcrumbs">
              {itemKey}
            </span>
          </div>
          <div className="actions-column">
            <button
              className="small-btn link-button"
              data-automation="findme-button"
              onClick={() => handleFindMe(treeNodePath)}
              aria-label="Find me"
            >
              Find me
            </button>
            <ExportMenu
              itemViewData={data}
              viewContext={viewContext}
              checkItemTypeMap={checkItemTypeMap}
              visibleColumnsFieldList={visibleColumnsFieldList}
              className="link-button"
            />
          </div>
        </div>

        <div className="main-toolbar">
          <div className="views-column">
            <ItemsViewHeaderTitle
              headingId={headingId}
              itemViewData={data}
              viewTitle={viewTitle}
              showTitle={true}
              isItem={true}
            />
            <span className={`${iconClass} type-icon`}>Item</span>
            <span className="dot-divider" />
            <button
              onClick={e => routeToItemDetailsView(e)}
              className="details-view link-button"
              data-automation="details-view-button"
            >
              View details
            </button>
            <ItemReviewLink itemId={itemId} />
          </div>
          <div className="actions-column">
            <div className="buttons-container">
              {this.getReplaceWithItemButton()}
              <EditButton
                onEdit={this.props.onEdit}
                tooltipMessage={cannotEditMessage}
                editDisabled={modifyDisabled}
              />
              <ItemDeleteController
                projectId={projectId}
                isSigned={isSigned}
                canBeDeleted={canBeDeleted}
                canBeModified={canBeModified}
                itemId={itemId}
                itemKey={itemKey}
                itemName={itemName}
                treeNodePath={treeNodePath}
              />
            </div>
          </div>
        </div>
        <hr />

        <div className="secondary-toolbar">
          <div className="views-column">
            <ItemsViewHeaderToggleButtonsContainer
              onChangeLayout={onChangeLayout}
              viewTitle={viewTitle}
              itemViewData={data}
              projectId={projectId}
              componentId={componentId}
              fieldConfig={fieldConfig}
              getCurrentFilter={() => {}}
              totalItemCount={totalItemCount}
              enableCoverage={false}
              className="small-btn"
            />
            <MenuDivider />
            {showFieldToggler && FieldTogglerComponent}
            <div className="inline-menu-item">
              <ReloadButton
                onRefresh={onRefresh}
                className="small-btn sr-label with-tooltip"
              />
            </div>
            <ItemSelectionCount
              selectedCount={selectedCount}
              totalItemCount={totalItemCount}
            />
          </div>
          <div className="actions-column">
            {this.getCompareAndPreviewButtons(atLeastOneItemSelected)}
          </div>
        </div>
      </header>
    )
  }
}
