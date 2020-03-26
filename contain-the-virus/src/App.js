import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Accordion, Card, Alert, Button, Container, Col, Row } from 'react-bootstrap'
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

    var drawingCells = this.randomInfection()

    this.printLogs = this.printLogs.bind(this)
    this.generateNewHandler = this.generateNewHandler.bind(this)
    this.reset = this.reset.bind(this)


    // TODO - check the infection can be stopped. If it can't we need to generate another

    this.state = {
      logs: [],
      drawingCellsBackup: JSON.parse(JSON.stringify(drawingCells)),
      drawingCells: drawingCells,
      spreadComplete: false,
      code: localStorage.getItem('code') ? localStorage.getItem('code') : `// matrix - a 2 dimensional array containing the properties infected, recentlyInfected, topBarrier, bottomBarrier, rightBarrier, and leftBarrier

function buildBarrier(matrix) {
  // stop the spread...
  console.log(matrix)
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
          infected: num < 2 ? true : false,
          recentlyInfected: false,
          topBarrier: false,
          bottomBarrier: false,
          rightBarrier: false,
          leftBarrier: false
        })

      }
    }

    return drawingCells


  }

  reset() {
    this.setState({
      drawingCells: JSON.parse(JSON.stringify(this.state.drawingCellsBackup)),
      logs: [],
      spreadComplete: false
    })
  }

  generateInfectionMap() {
    var rows = []
    for (var i = 0; i < size; i++) {
      var cells = []
      for (var x = 0; x < size; x++) {
        cells.push(
          <td style={{
            borderLeft: this.state.drawingCells[i][x].leftBarrier ? '3px solid purple' : '3px solid lightgrey',
            borderRight: this.state.drawingCells[i][x].rightBarrier ? '3px solid purple' : '3px solid lightgrey',
            borderBottom: this.state.drawingCells[i][x].bottomBarrier ? '3px solid purple' : '3px solid lightgrey',
            borderTop: this.state.drawingCells[i][x].topBarrier ? '3px solid purple' : '3px solid lightgrey',
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
    var drawingCells = this.randomInfection()
    this.setState({
      drawingCells: drawingCells,
      drawingCellsBackup: JSON.parse(JSON.stringify(drawingCells)),
      spreadComplete: false,
      logs: []
    })
  }

  getHealthyCellCount() {

    var count = 0

    for (var i = 0; i < size; i++) {
      for (var x = 0; x < size; x++) {
        if (!this.state.drawingCells[i][x].infected) count++
      }
    }

    return count
  }

  determineAlertText() {
    if (this.state.spreadComplete) {
      return (
        <Alert variant="info">
          You currently have {this.getHealthyCellCount()} healthy cell(s). The spread has stopped.
        </Alert>
      )
    } else {
      return (
        <Alert variant="warning">
          You currently have {this.getHealthyCellCount()} healthy cell(s), but you have not yet stopped the spread.
        </Alert>
      )
    }
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
              <Accordion defaultActiveKey="0">
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                      Instructions (click to minimise)
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <p>
                        Welcome to this coding challenge - your task is to develop an algorithm that stops the spread of a virus throughout a population by building barriers that stop infected cells infecting directly adjacent healthy cells. Complete the challenge yourself, or pair up with a friend, sibling, parent, child, or colleague and solve it as a team.<b> Most importantly, learn and have fun.</b>
                      </p>
                      <p>
                        The is a "right" answer to this solution, but that is not the purpose - as with any real-life problem solving activity, time and complexity are a constant trade-off. If you have never programmed before, you may struggle to come up with the best answer, but that does not matter. <b>A solution that saves 10 is better than a potential solution that could save 100 but could never be implemented, therefore saving nobody.</b>
                      </p>
                      <p>
                        The virus spreads to directly adjacent cells (i.e. a maximum of 4 healthy cells). An infectious region is one that contains a contiguous collection of infected cells, where barriers do not block the spread and where the infectious region abides by the rules that govern the spread. <b>The main constraint you have placed upon you is that you can only build a barrier around a single infected region each turn.</b>
                      </p>
                      <p>
                        When building a barrier, it must be reinforced from both sides (i.e. matrix[0][0].rightBarrier = true and matrix[0][1].leftBarrier = true).
                      </p>
                      <p>
                        Stop the spread by writing your algorithm below. Each time you click 'Next Turn', your algorithm will execute giving you the chance to build barriers. This is followed by a spread of the virus. Continue clicking 'Next Turn' until you have successfully stopped the virus or it has infected all healthy cells.
                      </p>
                      <p>
                        If you're new to programming, this challenge is in <a href="https://www.w3schools.com/js/">Javascript</a>. If you have any questions about the problem, or want some advice on your solution, please visit <a href="http://simonodonoghue.blog">simonodonoghue.blog</a> where you can find my contact details. I'd be happy to help.
                      </p>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              {this.determineAlertText()}
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
            <Col style={{textAlign: 'left'}}>
              <Button className="mr-2" onClick={this.generateNewHandler}>Generate New</Button>
              <Button onClick={this.reset}>Reset</Button>
            </Col>
            <Col style={{textAlign: 'right'}}>
              <Button onClick={(e) => {
                // TODO add a save button
                this.state.logs = []
                // save the code to storage
                localStorage.setItem('code', this.state.code)

                try {

                  var backupConsole = window.console.log

                  window.console.log = this.printLogs

                  var func = new Function(this.state.code + 'buildBarrier(this)').bind(this.state.drawingCells)

                  
                  func()
                  window.console.log = backupConsole

                  for (var i = 0; i < size; i++) {
                    for (var x = 0; x < size; x++) {
                      this.state.drawingCells[i][x].recentlyInfected = false
                    }
                  }

                  // TODO - need to check that walls are only being built around a single, contagious area

                  var infection = false
                  // update the infected cells based on the latest wall configuration
                  for (var i = 0; i < size; i++) {
                    for (var x = 0; x < size; x++) {
                      if (this.state.drawingCells[i][x].infected && !this.state.drawingCells[i][x].recentlyInfected) {
                        // it needs to spread
                        if (i > 0 && !this.state.drawingCells[i - 1][x].infected && !this.state.drawingCells[i][x].topBarrier) {
                          // spread up
                          this.state.drawingCells[i - 1][x].infected = true
                          this.state.drawingCells[i - 1][x].recentlyInfected = true
                          infection = true
                        }

                        if (x > 0 && !this.state.drawingCells[i][x - 1].infected && !this.state.drawingCells[i][x].leftBarrier) {
                          // spread left
                          this.state.drawingCells[i][x - 1].infected = true
                          this.state.drawingCells[i][x - 1].recentlyInfected = true
                          infection = true
                        }

                        if (i < size - 1 && !this.state.drawingCells[i + 1][x].infected && !this.state.drawingCells[i][x].bottomBarrier) {
                          // spread down
                          this.state.drawingCells[i + 1][x].infected = true
                          this.state.drawingCells[i + 1][x].recentlyInfected = true
                          infection = true
                        }

                        if (x < size - 1 && !this.state.drawingCells[i][x + 1].infected && !this.state.drawingCells[i][x].rightBarrier) {
                          // spread right
                          this.state.drawingCells[i][x + 1].infected = true
                          this.state.drawingCells[i][x + 1].recentlyInfected = true
                          infection = true
                        }
                      }
                    }
                  }

                  // TODO if there are no new infections and the number of walls == the number of walls in the solution, well done!

                  this.setState({
                    drawingCells: this.state.drawingCells,
                    logs: this.state.logs,
                    spreadComplete: !infection
                  })

                } catch (e) {
                  console.log("Error " + e)
                  this.setState({
                    logs: this.state.logs
                  })
                }


              }}>Next Turn</Button>
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
                <Col style={{ overflowY: 'scroll', height: '200px' }}>
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
