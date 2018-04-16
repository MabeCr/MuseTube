import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Song } from './../shared/song';
import { SONGS } from './../shared/saved-songs';
import { PlayerControlsComponent } from '../player-controls/player-controls.component';

@Component({
  selector: 'app-song-library',
  templateUrl: './song-library.component.html',
  styleUrls: ['./song-library.component.css']
})
export class SongLibraryComponent implements OnInit {

  @Input() playerControls: PlayerControlsComponent;

  songs: Song[];

  currentSongIndex: number;
  currentSong: Song;

  loadable: boolean;

  constructor() { }

  ngOnInit() {
    this.songs = SONGS;
    this.currentSongIndex = 0;
    this.currentSong = this.songs[0];
  }

  changeSong(newSongIndex: number) {
    if (this.loadable === true) {
      this.loadable = false;
      if (newSongIndex > this.songs.length - 1) {
        newSongIndex = 0;
      } else if (newSongIndex < 0) {
        newSongIndex = this.songs.length - 1;
      }
      this.currentSongIndex = newSongIndex;
      this.currentSong = this.songs[newSongIndex];
      this.playerControls.changeSong(this.currentSong);
    }
  }

  playPrevious() {
    this.changeSong(this.currentSongIndex - 1);
  }

  playNext() {
    this.changeSong(this.currentSongIndex + 1);
  }

}
