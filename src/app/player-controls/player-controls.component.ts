import { Component, OnInit } from '@angular/core';
import { UrlService } from './../services/url/url.service';
import { Song } from './../shared/song';
import { SONGS } from './../shared/saved-songs';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.css']
})
export class PlayerControlsComponent implements OnInit {

  public videoID = '';
  public player: any;
  public YT: any;

  songs: Song[] = SONGS;

  currentSongIndex: number;
  currentSong: Song = this.songs[0];

  loadable: boolean;

  statusString = 'Loading';

  constructor(private urlService: UrlService) {
  }

  init() {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  ngOnInit() {
    this.init();
    this.videoID = '' //video id

    window['onYouTubeIframeAPIReady'] = (e) => {
      this.YT = window['YT'];
      this.player = new window['YT'].Player('player', {
        videoId: this.videoID,
        height: 300,
        width: 350,
        playerVars: {'controls': 0, 'modestbranding': 1, 'rel': 0, 'showinfo': 0},
        events: {
          'onStateChange': this.onPlayerStateChange.bind(this),
          'onError': this.onPlayerError.bind(this),
          'onReady': (e) => {
            this.loadable = true;
            this.statusString = 'Playing';
            this.changeSong(0);
          }
        }
      });
    };
  }

  onPlayerStateChange(event) {
    // console.log(event)
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        this.loadable = true;
        this.statusString = 'Paused';
        // if (this.cleanTime() == 0) {
        //   console.log('started ' + this.cleanTime());
        // } else {
        //   console.log('playing ' + this.cleanTime())
        // };
        break;
      case window['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() != 0) {
          // console.log('paused' + ' @ ' + this.cleanTime());
        };
        this.statusString = 'Playing';
        break;
      case window['YT'].PlayerState.ENDED:
        this.changeSong(this.currentSongIndex + 1);
        break;
    };
  }

  cleanTime() {
    return Math.round(this.player.getCurrentTime())
  }

  onPlayerError(event) {
    switch (event.data) {
      case 2:
        console.log('' + this.videoID)
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    };
  }

  changeSong(index: number) {
    if (this.loadable === true) {
      this.loadable = false;
      if (index > this.songs.length - 1) {
        index = 0;
      }
      console.log(index);
      this.currentSongIndex = index;
      this.currentSong = this.songs[index];
      console.log(this.currentSong);
      let newVideoID = this.currentSong.videoID;
      let newStartTime = this.currentSong.startTime;
      let newEndTime = this.currentSong.endTime;
      this.player.loadVideoById({ 'videoId': newVideoID, 'startSeconds': newStartTime, 'endSeconds': newEndTime });
    }
  }

  playPrevious() {
    this.changeSong(this.currentSongIndex - 1);
  }

  playNext() {
    this.changeSong(this.currentSongIndex + 1);
  }

  playPause() {
    if (this.player.getPlayerState() == 1) { //playing
      // this.statusString = 'Paused';
      this.player.pauseVideo();
    } else {
      // this.statusString = 'Playing';
      this.player.playVideo();
    }
  }

  getString() {
    if (this.statusString === 'Paused') { 
      return 'Play'; //Reverse the current state to that the button reflects the correct action
    } else {
      return 'Pause';
    }
  }



}
