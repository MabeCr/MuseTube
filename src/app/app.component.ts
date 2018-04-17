import { Component } from '@angular/core';
import { Song } from './shared/song';
import { SONGS } from './shared/saved-songs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'YouMuse';
  currentSongIndex = 0;
  songs: Song[] = SONGS;

  onSongChanged(newSongIndex: number) {
    this.currentSongIndex = newSongIndex;
  }
}