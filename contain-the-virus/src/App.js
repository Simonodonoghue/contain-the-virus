import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Jumbotron, Button, Container, Col, Row } from 'react-bootstrap'
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import Prism from "prismjs";
import "./prism.css";

const size = 20

class App extends Component {


  constructor(props) {
    super(props)

    var drawingCells = []

    this.printLogs = this.printLogs.bind(this)
    this.generateNewHandler = this.generateNewHandler.bind(this)


    // TODO - check the infection can be stopped. If it can't we need to generate another

    this.state = {
      logs: [],
      drawingCells: this.randomInfection(),
      code: localStorage.getItem('code') ? localStorage.getItem('code') : `// matrix - a 2 dimensional array containing the properties infected, recentlyInfected, top, bottom, right, and left

function theFunction(matrix) {
  // stop the spread...
}`
    }


  }

  randomInfection() {

    var drawingCells = []

    for (var i = 0; i < size; i++) {
      drawingCells.push([])
      for (var x = 0; x < size; x++) {
        var num = Math.round(Math.random() * (50 - 0) + 0)

        drawingCells[i].push({
          infected: num < 7 ? true : false,
          recentlyInfected: false,
          top: false,
          bottom: false,
          right: false,
          left: false
        })

      }
    }

    return drawingCells


  }

  generateInfectionMap() {
    var rows = []
    for (var i = 0; i < size; i++) {
      var cells = []
      for (var x = 0; x < size; x++) {
        cells.push(
          <td style={{
            borderLeft: this.state.drawingCells[i][x].left ? '3px solid purple' : '1px solid grey',
            borderRight: this.state.drawingCells[i][x].right ? '3px solid purple' : '1px solid grey',
            borderBottom: this.state.drawingCells[i][x].bottom ? '3px solid purple' : '1px solid grey',
            borderTop: this.state.drawingCells[i][x].top ? '3px solid purple' : '1px solid grey',
            backgroundColor: this.state.drawingCells[i][x].infected ? 'red' : 'white'
          }}>

            {this.state.drawingCells[i][x].infected ? <div>I</div> : <div>-</div>}

          </td>
        )
      }
      rows.push(<tr>
        {cells}
      </tr>)
    }

    return rows
  }

  printLogs(log) {

    if (typeof (log) == 'object' || typeof (log) == 'array') {
      this.state.logs.push(
        <div className="console-line">
          <p>{JSON.stringify(log)}</p>
        </div>
      )
    } else {
      this.state.logs.push(
        <div className="console-line">
          <p>{log}</p>
        </div>
      )
    }
  }

  generateNewHandler() {
    this.setState({
      drawingCells: this.randomInfection()
    })
  }

  render() {
    return (
      <div className="App">

        <div className="App-header">
          <h2>Stop the Spread</h2>
        </div>
        <Container>
          <Row>
            <Col className="mt-3">
              <p>
                Welcome to this coding challenge - your task is develop an algorithm that stops the spread of a virus throughout a population by building barriers, stopping the virus from 'jumping' to uninfected cells
                </p>
              <p>
                The way in which you solve the problem is entirely up to you, there is no 1 right answer. Some may be more performan than others, but that isn't the goal of this challenge. You may want to find 2 or 3 friends and solve the problem collectively (it may help if someone in your team knows Javascript), or solve the problem on your own. If this is your first time programming, don't worry if it takes many attempts to solve. This is normal.
                </p>
              <p>
                The ask is simple - each turn of the game, every infected cell infects the cells directly adjacent to it, UNLESS there is a barrier between itself and the healthy cell.
                </p>
              <p>
                Can you write a program that will halt he spread of the virus?
                </p>
              <p>
                A few useful hints before you get started... 1) use console.log to debug your program, 2) when adding a barrier between cells, remember to add the barrier to both sides such as matrix[0][0].right = true and matrix[0][1].left = true
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <table style={{ width: '100%', textAlign: 'center' }}>
                {this.generateInfectionMap()}
              </table>
            </Col>


            <Col>
              <Row>
                <Col>
                  <div style={{ backgroundColor: '#f7f7f7' }}>
                    <div className="container_editor_area">
                      <Editor
                        placeholder="Type some code…"
                        value={this.state.code}
                        onValueChange={code => this.setState({ code })}
                        highlight={code => highlight(code, languages.js)}
                        padding={10}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Button onClick={this.generateNewHandler}>Generate New</Button>
            </Col>
            <Col>
              <Button onClick={(e) => {

                this.state.logs = []
                // save the code to storage
                localStorage.setItem('code', this.state.code)

                try {

                  var savedState = JSON.parse(JSON.stringify(this.state.drawingCells))

                  var func = new Function(this.state.code + 'theFunction(this)').bind(this.state.drawingCells)

                  var backupConsole = window.console.log

                  window.console.log = this.printLogs
                  func()
                  window.console.log = backupConsole

                  for (var i = 0; i < size; i++) {
                    for (var x = 0; x < size; x++) {
                      this.state.drawingCells[i][x].recentlyInfected = false
                    }
                  }

                  // TODO - need to check that walls are only being built in a single area

                  // update the infected cells based on the latest wall configuration
                  for (var i = 0; i < size; i++) {
                    for (var x = 0; x < size; x++) {
                      if (this.state.drawingCells[i][x].infected && !this.state.drawingCells[i][x].recentlyInfected) {
                        // it needs to spread
                        if (i > 0 && !this.state.drawingCells[i - 1][x].infected && !this.state.drawingCells[i][x].top) {
                          // spread up
                          this.state.drawingCells[i - 1][x].infected = true
                          this.state.drawingCells[i - 1][x].recentlyInfected = true
                        }

                        if (x > 0 && !this.state.drawingCells[i][x - 1].infected && !this.state.drawingCells[i][x].left) {
                          // spread left
                          this.state.drawingCells[i][x - 1].infected = true
                          this.state.drawingCells[i][x - 1].recentlyInfected = true
                        }

                        if (i < size - 1 && !this.state.drawingCells[i + 1][x].infected && !this.state.drawingCells[i][x].bottom) {
                          // spread down
                          this.state.drawingCells[i + 1][x].infected = true
                          this.state.drawingCells[i + 1][x].recentlyInfected = true
                        }

                        if (x < size - 1 && !this.state.drawingCells[i][x + 1].infected && !this.state.drawingCells[i][x].right) {
                          // spread right
                          this.state.drawingCells[i][x + 1].infected = true
                          this.state.drawingCells[i][x + 1].recentlyInfected = true
                        }
                      }
                    }
                  }

                  // TODO if all cells are infected - message to say solution isn't correct

                  /// TODO if there are no new infections and the number of walls == the number of walls in the solution, well done!

                  this.setState({
                    drawingCells: this.state.drawingCells,
                    logs: this.state.logs
                  })

                } catch (e) {
                  console.log("Error " + e)
                }


              }}>Step</Button>
              <Button>Run</Button>
            </Col>

          </Row>
          <Row className="mt-3">
            <Col>
              <Row>
                <Col>
                  <h2>Console</h2>
                </Col>
              </Row>
              <Row>
                <Col>
                  {this.state.logs}
                </Col>
              </Row>
            </Col>
          </Row>

        </Container>
      </div>
    );
  }
}

export default App;
