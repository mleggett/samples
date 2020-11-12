import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import './Switch.scss'
import { uniqueId } from 'lodash'

class Switch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: false,
    }
  }

  handleChange = () => {
    this.props.onChange(this.props.isSelected)
  }

  handleFocus = () => {
    this.setState({ focused: true })
  }

  handleBlur = () => {
    this.setState({ focused: false })
  }

  render() {
    const isSelected = this.props.isSelected
    const { labelText } = this.props
    const { focused } = this.state
    const classes = classnames('switch', { focused })

    const switchName = uniqueId('switch')
    return (
      <div className="switch-container">
        <span className="label-text">{labelText}</span>
        <div className={classes} data-automation="switch-toggle">
          <input
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            className="switch-input"
            type="checkbox"
            name={switchName}
            onChange={this.handleChange}
          />
          <label
            className="switch-paddle"
            htmlFor={switchName}
            role="checkbox"
            aria-checked={isSelected}
            onClick={this.handleChange}
          >
            <div className="paddles">
              <div className="toggle-state">{isSelected ? 'ON' : 'OFF'}</div>
              <div className="white-circle" />
            </div>
          </label>
        </div>
      </div>
    )
  }
}

Switch.propTypes = {
  labelText: PropTypes.string,
  isSelected: PropTypes.bool,
  onChange: PropTypes.func,
}

export default Switch
