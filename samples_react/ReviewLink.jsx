import React, { Fragment, useEffect, useState } from 'react'
import api from '../api'

function handleClick(url) {
  window.open(url, '_blank')
}

export default function ReviewLink({ itemId }) {
  const [reviewKey, setReviewKey] = useState()
  const [reviewName, setReviewName] = useState()
  const [url, setUrl] = useState()
  const [isDeleted, setIsDeleted] = useState()
  const [hasReview, setHasReview] = useState(false)

  useEffect(() => {
    setReviewKey(null)
    setReviewName(null)
    setUrl(null)
    setIsDeleted(null)
    setHasReview(false)

    api.getReviewLink(itemId).then(result => {
      setReviewKey(result.data.reviewKey)
      setReviewName(result.data.reviewName)
      setUrl(result.data.url)
      setIsDeleted(result.data.deleted)
      setHasReview(true)
    })
  }, [itemId])

  const disabledMessage = isDeleted
    ? 'Review has been deleted'
    : 'You don’t have access to this review'
  const isDisabled = !url
  const titleMessage = isDisabled ? disabledMessage : reviewName

  if (hasReview) {
    return (
      <Fragment>
        <span className="dot-divider" />
        <button
          onClick={() => handleClick(url)}
          className="details-view link-button"
          data-automation="review-link-button"
          disabled={isDisabled}
          title={titleMessage}
        >
          View {reviewKey}
        </button>
      </Fragment>
    )
  }
  return null
}
