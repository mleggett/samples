import React from 'react'

export default function Cell (props) {
    return (
        <article className={`game-cell ${props.isAlive? 'alive' : ''}`}> </article>
    )
}
