import React, { Component } from 'react'
import Cell from "./Cell"
import Row from "./Row";

export class GameController extends Component {
    componentDidMount() {
        this.width = 30
        this.height = 30
        this.state = {
            generationCount: 0,
            componentGrid: [],
            gridData: [],
        }
        this.timer = setInterval(() => {
            this.generation()
        }, 300)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    generation() {
        this.setState ({
            generationCount: this.state.generationCount + 1,
            componentGrid: this.getGrid()
        })
    }

    initIsAlive() {
        return Math.floor(Math.random() * Math.floor(2)) === 1
    }

    isAlive(i, j) {
        let liveNeighborsCount = 0
        let m
        const grid = this.state.componentGrid
        const neighbors = []
        const rowBefore = grid[i - 1]
        const currentRow = grid[i]
        const nextRow = grid[i + 1]

        if (rowBefore) {
            neighbors.push(rowBefore.props.children[j-1])
            neighbors.push(rowBefore.props.children[j])
            neighbors.push(rowBefore.props.children[j+1])
        }

        neighbors.push(currentRow.props.children[j-1])
        neighbors.push(currentRow.props.children[j+1])

        if (nextRow) {
            neighbors.push(nextRow.props.children[j-1])
            neighbors.push(nextRow.props.children[j])
            neighbors.push(nextRow.props.children[j+1])
        }

        for(m = 0; m < neighbors.length; m++ ) {
            if (neighbors[m] && neighbors[m].props.isAlive) {
                liveNeighborsCount++
            }
        }
        const currentCellIsAlive = grid[i].props.children[j].props.isAlive
        return liveNeighborsCount === 3 || ( currentCellIsAlive && liveNeighborsCount === 2 )
    }

    getGrid() {
        const grid = []
        let rowCells = []
        let i
        let j

        for(i=0; i < this.height; i++) {
            for (j = 0; j < this.width; j++) {
                const isAlive = this.state.componentGrid.length > 0 ? this.isAlive(i, j) : this.initIsAlive()
                rowCells[j] = <Cell isAlive={isAlive} key={`cell-${i}-${j}`}/>
            }
            grid[i] = <Row key={`row-${i}`}>{rowCells}</Row>
            rowCells = []
        }

        return(
            grid
        )
    }

    render() {
        if (!this.state) {
            return null
        }
        return (
            <div className="grid-positioner">
                <div className="game-grid">
                    {this.state.componentGrid}
                </div>
            </div>
        );
    }
}
