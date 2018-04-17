import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, NgZone } from '@angular/core';
import { Song } from './../shared/song';
import { SongLibraryComponent } from '../song-library/song-library.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.css']
})
export class PlayerControlsComponent implements OnInit, OnChanges {
  @Input() currentSongIndex: number = 0;
  @Input() songs: Song[] = [];
  @Input() searchResults: Song[] = [];
  @Output() songChanged = new EventEmitter<number>();

  public videoID = '';
  public player: any;
  public YT: any;
  statusString = 'Loading';
  isPlayerLoaded = false;
  private hasLoadedSongStarted = false;

  constructor(private titleService: Title, private zone: NgZone) {
  }

  get currentSong(): Song {
    if (this.searchResults.length > 0) {
      return this.searchResults[this.currentSongIndex];
    }
    return this.songs[this.currentSongIndex];
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
          'onStateChange': (e) => {
            this.zone.run(() => {
              this.onPlayerStateChange(e)
            });
          },
          'onError': this.onPlayerError.bind(this),
          'onReady': (e) => {
            this.zone.run(() => {
              this.isPlayerLoaded = true;
              this.loadSong(this.currentSong);
            }
            );
          }
        }
      });
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    //If the current song index changed, play new song.
    if (this.isPlayerLoaded && changes.currentSongIndex) {
      let newSongIndex = changes.currentSongIndex.currentValue as number;
      let currentSong: Song;
      if (this.searchResults.length > 0) {
        currentSong = this.searchResults[newSongIndex];
      } else {
        currentSong = this.songs[newSongIndex];
      }
      this.loadSong(currentSong);
    }
  }

  onPlayerStateChange(event) {
    // console.log(event)
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        console.log("PLAYING");
        this.statusString = 'Playing';
        this.hasLoadedSongStarted = true;
        // if (this.cleanTime() == 0) {
        //   console.log('started ' + this.cleanTime());
        // } else {
        //   console.log('playing ' + this.cleanTime())
        // };
        this.titleService.setTitle(this.currentSong.title + ' - ' + this.currentSong.artist);
        break;
      case window['YT'].PlayerState.PAUSED:
        console.log("PAUSED");
        if (this.player.getDuration() - this.player.getCurrentTime() != 0) {
          // console.log('paused' + ' @ ' + this.cleanTime());
          
        };
        this.statusString = 'Paused';
        this.titleService.setTitle('Paused: ' + this.currentSong.title + ' - ' + this.currentSong.artist);
        break;
      case window['YT'].PlayerState.ENDED:
        console.log("ENDED");
        //Workaround strange bug when video ends at manual end time, calls ENDED twice.
        //Only load next song once current song has started.
        if (this.hasLoadedSongStarted) {
          this.onPlayNext();
        }
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

  private loadSong(newSong: Song) {
    if (newSong) {
      this.hasLoadedSongStarted = false;
      let newVideoID = newSong.videoID;
      let newStartTime = newSong.startTime;
      let newEndTime = newSong.endTime;
      this.titleService.setTitle(this.currentSong.title + ' - ' + this.currentSong.artist);
      if (newStartTime === null && newEndTime === null) {
        this.player.loadVideoById({ 'videoId': newVideoID });
      } else if (newStartTime === null) {
        this.player.loadVideoById({ 'videoId': newVideoID, 'endSeconds': newEndTime });
      } else if (newEndTime === null) {
        this.player.loadVideoById({ 'videoId': newVideoID, 'startSeconds': newStartTime });
      } else {
        this.player.loadVideoById({ 'videoId': newVideoID, 'startSeconds': newStartTime, 'endSeconds': newEndTime });
      }
    }
  }

  onPlayPrevious() {
    this.songChanged.emit(this.currentSongIndex - 1);
  }

  onPlayNext() {
    this.songChanged.emit(this.currentSongIndex + 1);
  }

  onPlayPause() {
    if (this.player.getPlayerState() == 1) { //playing
      this.player.pauseVideo();
    } else {
      this.player.playVideo();
    }
  }

  onVolumeUp() {
    let currentVolume = this.player.getVolume();
    if (currentVolume < 100) {
      this.player.setVolume(currentVolume + 10);
    }
  }

  onVolumeDown() {
    let currentVolume = this.player.getVolume();
    if (currentVolume > 0) {
      this.player.setVolume(currentVolume - 10);
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