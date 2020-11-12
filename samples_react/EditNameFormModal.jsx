import React, { Component } from 'react'
import Modal from '../components/modal/Modal'
import ModalContent from '../components/modal/ModalContent'
import ModalFooter from '../components/modal/ModalFooter'
import SecondaryButton from '../components/button/SecondaryButton'
import RequiredTextInput from '../components/input/RequiredTextInput'
import { isValidString } from '../helpers/isValidString'
import PropTypes from 'prop-types'

const NAME_INPUT_ID = 'form-modal-name-input'

export default class EditNameFormModal extends Component {
  static propTypes = {
    data: PropTypes.shape({
      submitFormCallback: PropTypes.func,
      title: PropTypes.string,
      initialNameValue: PropTypes.string,
    }),
  }
  constructor(props) {
    super(props)

    this.state = {
      showModal: true,
      nameValue: this.props.data.initialNameValue,
    }
  }

  openModal = () => {
    this.setState({ showModal: true, nameValue: this.state.nameValue })
  }

  closeModal = () => {
    this.setState({ showModal: false, nameValue: this.state.nameValue })
  }

  onConfirm = e => {
    e.preventDefault()
    const nameValue = this.state.nameValue
    if (!isValidString(nameValue)) {
      return
    }
    this.props.data.submitFormCallback(nameValue)
  }

  onAfterOpen = () => {
    document.getElementById(NAME_INPUT_ID).focus()
  }

  handleChange = e => {
    this.setState({
      nameValue: e.target.value,
    })
  }

  render() {
    return (
      <Modal
        title={this.props.data.title}
        data-automation="add-edit-name-modal"
        className="add-modal ext-styled-modal"
        isOpen={this.state.showModal}
        onRequestClose={this.closeModal}
        onAfterOpen={this.onAfterOpen}
      >
        <form className="ext-styled-modal-form" onSubmit={this.onConfirm}>
          <div className="ext-modal-bib">
            <ModalContent>
              <RequiredTextInput
                label="Name:"
                defaultValue={this.state.nameValue}
                maxLength={255}
                onChange={this.handleChange}
                id={NAME_INPUT_ID}
                dataAutomation={NAME_INPUT_ID}
                autoComplete="off"
                focusImmediately={true}
              />
            </ModalContent>
          </div>
          <ModalFooter>
            <input type="submit" className="primary-button" value="Save" />
            <SecondaryButton
              className="dismiss-button"
              onClick={this.closeModal}
              dataAutomation="dismiss-button"
            >
              Cancel
            </SecondaryButton>
          </ModalFooter>
        </form>
      </Modal>
    )
  }
}
