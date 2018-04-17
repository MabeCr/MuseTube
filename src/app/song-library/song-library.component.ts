import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Song } from './../shared/song';

@Component({
  selector: 'app-song-library',
  templateUrl: './song-library.component.html',
  styleUrls: ['./song-library.component.css']
})
export class SongLibraryComponent {

  @Input() currentSongIndex: number = 0;
  @Input() songs: Song[] = [];
  @Output() songChanged = new EventEmitter<number>();

  constructor() { }

  get currentSong(): Song {
    return this.songs[this.currentSongIndex];
  }

  isCurrentSong(songIndex: number): boolean {
    return songIndex === this.currentSongIndex;
  }

  onChangeSong(newSongIndex: number) {
    if (newSongIndex > this.songs.length - 1) {
      newSongIndex = 0;
    } else if (newSongIndex < 0) {
      newSongIndex = this.songs.length - 1;
    }
    this.songChanged.emit(newSongIndex);
  }
}
