import { Component, OnInit, Input } from '@angular/core';
import { Song } from './../shared/song';
import { SongLibraryComponent } from '../song-library/song-library.component';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.css']
})
export class PlayerControlsComponent implements OnInit {

  @Input() songLibrary: SongLibraryComponent

  public videoID = '';
  public player: any;
  public YT: any;

  currentSong: Song;

  statusString = 'Loading';

  constructor() {
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
        playerVars: { 'controls': 1, 'modestbranding': 1, 'rel': 0, 'showinfo': 0 },
        events: {
          'onStateChange': this.onPlayerStateChange.bind(this),
          'onError': this.onPlayerError.bind(this),
          'onReady': (e) => {
            this.songLibrary.loadable = true;
            this.statusString = 'Playing';
            this.songLibrary.changeSong(0);
          }
        }
      });
    };
  }

  onPlayerStateChange(event) {
    // console.log(event)
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        this.songLibrary.loadable = true;
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
        this.playNext();
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

  changeSong(newSong: Song) {
    if (newSong !== undefined) {
      let newVideoID = newSong.videoID;
      let newStartTime = newSong.startTime;
      let newEndTime = newSong.endTime;
      this.currentSong = newSong;

      if (newStartTime === null && newEndTime === null) {
        this.player.loadVideoById({ 'videoId': newVideoID});
      } else if (newStartTime === null) {
        this.player.loadVideoById({ 'videoId': newVideoID, 'endSeconds': newEndTime });
      } else if (newEndTime === null) {
        this.player.loadVideoById({ 'videoId': newVideoID, 'startSeconds': newStartTime});
      } else {
        this.player.loadVideoById({ 'videoId': newVideoID, 'startSeconds': newStartTime, 'endSeconds': newEndTime});
      }
    }
  }

  playPrevious() {
    this.songLibrary.playPrevious();
  }

  playNext() {
    this.songLibrary.playNext();
  }

  playPause() {
    if (this.player.getPlayerState() == 1) { //playing
      this.player.pauseVideo();
    } else {
      this.player.playVideo();
    }
  }

  getString() {
    if (this.statusString === 'Paused') {
      return 'Play'; //Reverse the current state to that the button reflects the correct action
    } else {
      return 'Pause'; //Set it to pause automatically as the default on load
    }
  }



}
