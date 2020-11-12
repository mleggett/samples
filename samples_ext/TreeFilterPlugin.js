Ext.ns('plugin')

plugin.TreeFilterPlugin = Ext.extend(Object, {
  init(treePanel) {
    this.lastFilterText = ''
    this.treePanel = treePanel
    this.rootNode = this.treePanel.getRootNode()
  },

  filterTree(filterText) {
    this.treePanel.loadMask.show()
    filterText = filterText.trim()
    const filteredClass = 'filtered'
    const filterTextIsEmpty = filterText.length === 0
    const lastFilterText = this.lastFilterText
    const lastFilterTextIsEmpty = lastFilterText.length === 0
    if (filterTextIsEmpty) {
      this.treePanel.collapseAll()
      filterText = lastFilterText
      this.treePanel.removeClass(filteredClass)
      if (lastFilterTextIsEmpty) {
        this.treePanel.loadMask.hide()
        return
      }
    } else {
      this.treePanel.addClass(filteredClass)
    }
    this.lastFilterText = filterText
    setTimeout(() => {
      this.filterChildTreeNodes(
        this.rootNode.childNodes,
        filterText.toLowerCase(),
        filterTextIsEmpty
      )
    }, 10)
  },

  filterChildTreeNodes(childNodes, filterText, clearingFilter) {
    let i = childNodes.length
    while (i > 0) {
      const treeNode = childNodes[i - 1]
      const currentText = treeNode.ui
        ? treeNode.ui.textNode.textContent.toLowerCase()
        : util.StringUtil.htmlEntityDecode(treeNode.text.toLowerCase())
      if (currentText.indexOf(filterText) >= 0) {
        treeNode.ui.show()
        treeNode.ui.addClass('filter-match')
        this.expandParents(treeNode, clearingFilter)
      } else if (clearingFilter) {
        treeNode.ui.show()
      } else {
        treeNode.ui.hide()
        treeNode.ui.removeClass('filter-match')
      }
      if (treeNode.hasChildNodes()) {
        if (!clearingFilter) {
          treeNode.expand()
        }
        setTimeout(
          this.filterChildTreeNodes(
            treeNode.childNodes,
            filterText,
            clearingFilter
          ),
          0
        )
      }
      i--
    }
    this.treePanel.loadMask.hide()
  },

  expandParents(node, clearingFilter) {
    const parentNode = node.parentNode
    if (parentNode) {
      parentNode.ui.show()
      if (clearingFilter) {
        parentNode.expand()
      }
      this.expandParents(parentNode, clearingFilter)
    }
  },
})
