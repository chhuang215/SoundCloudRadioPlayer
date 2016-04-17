import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Songs = new Mongo.Collection('songs');


if(Meteor.isServer){
  Meteor.publish("songs", function(){
    return Songs.find();
  });
}

Meteor.methods({
  'songs.insert':function(track){
    let s = Songs.findOne({"track.id":track.id});
    if(!s){
       Songs.insert({
         track:track,
         addedOn : new Date()
       });
     }
  },

  'songs.remove':function(songId){
     Songs.remove({
       _id:songId
     });
  }
});
