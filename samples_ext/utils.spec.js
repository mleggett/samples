import {
  itemTreeFindMe,
  routeToItem,
  getItemIconClassNames,
} from './utils'
import appContext from '../constants/appContext'
import jx from '../constants/jx'

describe('item utils', () => {
  const treeNodePath = '/head/shoulders/knees/toes'
  const originalJxHack = hack
  const itemId = 22
  const projectId = 33

  describe('itemTreeFindMe', () => {
    beforeEach(() => {
      appContext.fireEvent.calls.reset()
    })

    it('broadcasts an event on appContext', () => {
      itemTreeFindMe(treeNodePath)
      expect(appContext.fireEvent).toHaveBeenCalled()
    })
  })

  describe('routeToItem', () => {
    beforeEach(() => {
      hack = {
        location: [],
      }
    })

    afterEach(() => {
      hack = originalJxHack
    })

    it('adds a path to our routing', () => {
      routeToItem(itemId, projectId)
      expect(hack.location).toEqual([
        `/items/${itemId}/list?projectId=${projectId}`,
      ])
    })
  })

  describe('getItemIconClassNames', () => {
    describe('when the item has signatures', () => {
      it('returns a classname indicating that the item has signatures', () => {
        const result = getItemIconClassNames(true)
        expect(result).toBe('j-item-signed-icon')
      })
    })
    describe('when the item does not have signatures', () => {
      it('returns a classname that does not indicate that the item has signatures', () => {
        const result = getItemIconClassNames(false)
        expect(result).toBe('j-item-icon')
      })
    })
  })
})
