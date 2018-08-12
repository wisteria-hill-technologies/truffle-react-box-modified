import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: '',
      inputValue: '',
    }
  }

  async componentDidMount() {
    const web3 = await getWeb3;
    this.web3 = web3.web3;
    
    const contract = require('truffle-contract')
    const simpleStorage = await contract(SimpleStorageContract)
    simpleStorage.setProvider(this.web3.currentProvider);
    this.contractInstance = await simpleStorage.deployed();

    let message = await this.contractInstance.message.call();
    this.setState({ message });
    this.contractInstance.MessageEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event)=>{  //it is important to use arrow function here. Otherwise, 'this' will be lost.
      let message = event.args.message;
      this.setState({ message, inputValue: "" });
    });
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const accounts = await this.web3.eth.accounts;
    await this.contractInstance.setMessage(this.state.inputValue, { from: accounts[0] })
    this.setState({
      message: "",
      inputValue: ""
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React on Ethereum!</h1>
        </header>
        <p className="App-intro">
          {
            this.state.message? this.state.message: "Loading..."
          }
        </p>
        <form onSubmit={this.onSubmit}>
          <input
            value={this.state.inputValue}
            onChange={e => this.setState({ inputValue: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default App
