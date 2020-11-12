import React from 'react'
import icons from '../../components/icons'

const ReloadButton = props => {
  const { onRefresh, className } = props
  const { ReloadIcon } = icons
  const labelText = 'Refresh'

  return (
    <button
      className={className}
      data-automation="reload-button"
      onClick={e => onRefresh(e)}
      aria-label={labelText}
    >
      <ReloadIcon />
    </button>
  )
}

export default ReloadButton
