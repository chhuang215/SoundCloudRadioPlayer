import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import * as SC from 'soundcloud';
import {RadioPlayer} from '/lib/collections/RadioPlayer.js';
import {Songs} from '/lib/collections/SongCollection.js';
import Song from './Song';
import PlayerInterface from './PlayerInterface';

class App extends Component{

  getPlayer(){

    if(this.props.radioPlayers[0]){
      return <PlayerInterface radioPlayer={this.props.radioPlayers[0]} songs={this.props.songs}/>;
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
  radioPlayers: PropTypes.array.isRequired,
  songs: PropTypes.array.isRequired
};

export default createContainer(()=>{

  Meteor.subscribe("radioplayer");
  Meteor.subscribe("songs");
  return{
    radioPlayers: RadioPlayer.find({}).fetch(),
    songs: Songs.find({}, {sort: {addedOn:1}}).fetch()
  };

}, App);
