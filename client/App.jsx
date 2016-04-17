import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import * as SC from 'soundcloud';
import {RadioPlayer} from '../lib/collections/RadioPlayer.js';
import Song from './Song';
import Player from './Player';

class App extends Component{

  getPlayer(){

    if(this.props.radioPlayers[0]){
      return <Player params={{radioPlayerId: this.props.radioPlayers[0]._id}} radioPlayerId={this.props.radioPlayers[0]._id}/>;
    }
  }

  render(){

    return (
      <div className="container">
        <header><h1>Soundcloud Req Radio Player</h1></header>
        {this.getPlayer()}

        <br/>

      </div>
    )
  }
}

App.propTypes={
  radioPlayers: PropTypes.array.isRequired
};

export default createContainer(()=>{

  Meteor.subscribe("radioplayer");

  return{
    radioPlayers: RadioPlayer.find({}).fetch()
  };

}, App);
