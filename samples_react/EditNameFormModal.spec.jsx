import React from 'react'
import { shallow } from 'enzyme'
import EditNameFormModal from './EditNameFormModal'

describe('EditNameFormModal', () => {
  describe('by default', () => {
    const fakeData = {
      initialNameValue: 'squirrel jamboree',
      submitFormCallback: () => {},
      title: 'all fun all the time',
    }
    const subject = shallow(<EditNameFormModal data={fakeData} />)

    it('renders a ModalPortal, ModalContent, and a RequiredTextInput', () => {
      const modal = subject.find('ModalPortal')
      const modalContent = subject.find('ModalContent')
      const RequiredTextInput = subject.find('RequiredTextInput')

      expect(modal.length).toBe(1)
      expect(modalContent.length).toBe(1)
      expect(RequiredTextInput.length).toBe(1)
    })

    it('renders cancel and save buttons', () => {
      const saveButton = subject.find('input[type="submit"]')
      const cancelButton = subject.find('SecondaryButton')

      expect(saveButton.length).toBe(1)
      expect(saveButton.prop('value')).toBe('Save')
      expect(cancelButton.length).toBe(1)
      expect(cancelButton.dive().text()).toBe('Cancel')
    })

    it('sets the default name', () => {
      const RequiredTextInput = subject.find('RequiredTextInput')
      expect(RequiredTextInput.prop('defaultValue')).toBe(
        fakeData.initialNameValue
      )
    })

    it('closes when the "Cancel" button is clicked', () => {
      const cancelButton = subject.find('SecondaryButton')

      expect(subject.state('showModal')).toBeTruthy()
      cancelButton.simulate('click')
      expect(subject.state('showModal')).toBeFalsy()
    })

    describe('when the form is submitted', () => {
      it('calls a callback', () => {
        const callbackSpy = jasmine.createSpy('submitCallback')
        fakeData.submitFormCallback = callbackSpy
        const subjectWithCallback = shallow(
          <EditNameFormModal data={fakeData} />
        )
        const form = subjectWithCallback.find('form')
        const event = {
          preventDefault: jasmine.createSpy('preventDefault'),
        }

        form.simulate('submit', event)
        expect(event.preventDefault).toHaveBeenCalled()
        expect(callbackSpy).toHaveBeenCalledWith(fakeData.initialNameValue)
      })
      describe('and the form is invalid', () => {
        it('does not call the callback', () => {
          const fakeDataThatIsAlsoInvalidDataOhMy = {
            initialNameValue: '  ',
            submitFormCallback: () => {},
            title: 'titles - so fun',
          }
          const callbackSpy = jasmine.createSpy('submitCallback')
          fakeData.submitFormCallback = callbackSpy
          const subjectWithCallback = shallow(
            <EditNameFormModal data={fakeDataThatIsAlsoInvalidDataOhMy} />
          )
          const form = subjectWithCallback.find('form')
          const event = {
            preventDefault: jasmine.createSpy('preventDefault'),
          }

          form.simulate('submit', event)
          expect(event.preventDefault).toHaveBeenCalled()
          expect(callbackSpy).not.toHaveBeenCalled()
        })
      })
    })

    it('stores the name that the user inputs', () => {
      const RequiredTextInput = subject.find('RequiredTextInput')
      const newName = 'Squeegee-weilding hamster clean-up master squad'

      RequiredTextInput.simulate('change', {
        target: { value: newName },
      })

      expect(subject.state('nameValue')).toBe(newName)
    })

    it('does not call the callback when the form is submitted and the user has input no name', () => {
      const callbackSpy = jasmine.createSpy('submitCallback')
      const newName = ''
      const fakeData = {
        submitFormCallback: callbackSpy,
      }
      const subjectWithCallback = shallow(
        <EditNameFormModal data={fakeData} />
      )
      const RequiredTextInput = subjectWithCallback.find('RequiredTextInput')
      const form = subjectWithCallback.find('form')
      const event = {
        preventDefault: jasmine.createSpy('preventDefault'),
      }
      RequiredTextInput.simulate('change', {
        target: { value: newName },
      })

      form.simulate('submit', event)
      expect(event.preventDefault).toHaveBeenCalled()
      expect(callbackSpy).not.toHaveBeenCalled()
    })
  })
})
