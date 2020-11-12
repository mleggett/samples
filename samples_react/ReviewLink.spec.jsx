import React from 'react'
import { shallow, mount } from 'enzyme'
import ReviewLink from './ReviewLink'
import api from '../api'

describe('ReviewLink', () => {
  it('should render nothing when itemId is null', () => {
    const subject = shallow(<ReviewLink />)
    expect(subject.isEmptyRender()).toBeTrue()
  })

  it('should render without errors when itemId is null', () => {
    expect(() => shallow(<ReviewLink />)).not.toThrow()
  })

  describe('itemId is provided', () => {
    const itemId = 5

    it('should call the api for review link details', () => {
      spyOn(api, 'getReviewLink').and.returnValue(Promise.resolve(''))

      mount(<ReviewLink itemId={itemId} />)
      expect(api.getReviewLink).toHaveBeenCalled()
    })

    describe('api responds with an accessible review', () => {
      let subject
      beforeEach(() => {
        const response = {
          data: {
            reviewKey: 'REV-999 v000',
            reviewName: 'The Kittens are always watching',
            url: 'http://coolcats.me',
            deleted: false,
          },
        }
        spyOn(api, 'getReviewLink').and.returnValue(
          Promise.resolve(response)
        )
        subject = mount(<ReviewLink itemId={itemId} />)
        Promise.runAll()
        subject.update()
      })

      it('should render the key as a link button', () => {
        const button = subject.find('button')
        expect(button.text()).toBe('View REV-999 v000')
      })

      it('should render the dot divider', () => {
        const dotDivider = subject.find('span[className="dot-divider"]')
        expect(dotDivider).toExist()
      })

      it('should render a title matching the name of the review', () => {
        const button = subject.find('button')
        expect(button.prop('title')).toBe('The Kittens are always watching')
      })

      it('should be enabled', () => {
        const button = subject.find('button')
        expect(button.prop('disabled')).toBeFalse()
      })

      describe('when the link button is clicked', () => {
        it('should open the uri in a new tab', () => {
          spyOn(window, 'open')
          subject.find('button').simulate('click')
          expect(window.open).toHaveBeenCalledWith(
            'http://coolcats.me',
            '_blank'
          )
        })
      })
    })

    describe('api responds with a 404', () => {
      let subject

      beforeEach(() => {
        spyOn(api, 'getReviewLink').and.returnValue(
          Promise.reject('')
        )
        subject = mount(<ReviewLink itemId={itemId} />)
        Promise.runAll()
        subject.update()
      })

      it('should render nothing', () => {
        const subject = shallow(<ReviewLink />)
        expect(subject.isEmptyRender()).toBeTrue()
      })
    })

    describe('api responds with a deleted review', () => {
      let subject
      beforeEach(() => {
        const response = {
          data: {
            reviewKey: 'REV-999 v000',
            deleted: true,
          },
        }
        spyOn(api, 'getReviewLink').and.returnValue(
          Promise.resolve(response)
        )

        subject = mount(<ReviewLink itemId={itemId} />)
        Promise.runAll()
        subject.update()
      })
      it('should render a title with a "Review has been deleted" message', () => {
        const button = subject.find('button')
        expect(button.prop('title')).toBe('Review has been deleted')
      })
      it('should render a disabled link button', () => {
        const button = subject.find('button')
        expect(button.prop('disabled')).toBeTrue()
      })
    })

    describe('api responds with a review that the user does not have access to', () => {
      let subject
      beforeEach(() => {
        const response = {
          data: {
            reviewKey: 'REV-999 v000',
            deleted: false,
          },
        }

        spyOn(api, 'getReviewLink').and.returnValue(
          Promise.resolve(response)
        )
        subject = mount(<ReviewLink itemId={itemId} />)
        Promise.runAll()
        subject.update()
      })

      it('should render a title with a "You dont have access" message', () => {
        const button = subject.find('button')
        expect(button.prop('title')).toBe(
          'You don’t have access to this review'
        )
      })
      it('should render a disabled link button', () => {
        const button = subject.find('button')
        expect(button.prop('disabled')).toBeTrue()
      })
    })
  })
})
