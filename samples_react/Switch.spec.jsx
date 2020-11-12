import React from 'react'
import { shallow } from 'enzyme'
import Switch from './Switch'

describe('Switch', () => {
  it('renders without errors', () => {
    expect(() => shallow(<Switch />)).not.toThrow()
  })

  it('uses a checkbox for core functionality', () => {
    const subject = shallow(<Switch />)
    expect(subject.find('[type="checkbox"]')).toExist()
  })

  describe('when passed a label-text prop', () => {
    it('renders the text of the prop', () => {
      const myAmazingString = 'I love you everything burrito'
      const subject = shallow(
        <Switch labelText={'I love you everything burrito'} />
      )
      expect(subject.find('.label-text').text()).toBe(myAmazingString)
    })
  })

  describe('when not passed a label-text prop', () => {
    it('does not render anything for the label', () => {
      const subject = shallow(<Switch />)
      expect(subject.find('.label-text').text()).toBe('')
    })
  })

  describe('when isSelected is set to true', () => {
    it('displays the "on" state', () => {
      const subject = shallow(<Switch isSelected={true} />)
      expect(subject.find('[aria-checked=true]')).toExist()
      expect(subject.find('.toggle-state').text()).toBe('ON')
    })
  })

  describe('when isSelected is set to false', () => {
    it('displays the "off" state', () => {
      const subject = shallow(<Switch isSelected={false} />)
      expect(subject.find('[aria-checked=false]')).toExist()
      expect(subject.find('.toggle-state').text()).toBe('OFF')
    })
  })

  it('has a click handler', () => {
    const clickSpy = jasmine.createSpy('onClickHandler')
    const subject = shallow(<Switch onChange={clickSpy} />)
    const clickableThing = subject.find('.switch-paddle')
    clickableThing.simulate('click')

    expect(clickSpy).toHaveBeenCalled()
  })

  it('has some accessibility attributes', () => {
    const subject = shallow(<Switch isSelected={true} />)
    const togglePaddle = subject.find('.switch-paddle')
    expect(togglePaddle.prop('role')).toBe('checkbox')
  })

  it('has a focus outline when the checkbox is focused', () => {
    const subject = shallow(<Switch isSelected={true} />)
    subject.find('.switch-input').simulate('focus')
    expect(subject.find('.switch')).toHaveClassName('focused')
  })

  it('does not have a focus outline when the checkbox is focused', () => {
    const subject = shallow(<Switch isSelected={true} />)
    subject.find('.switch-input').simulate('blur')
    expect(subject.find('.switch')).not.toHaveClassName('focused')
  })
})
