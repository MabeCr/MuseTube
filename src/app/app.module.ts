import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Components
import { AppComponent } from './app.component';
import { PlayerControlsComponent } from './player-controls/player-controls.component';

//Services
import { SongLibraryComponent } from './song-library/song-library.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerControlsComponent,
    SongLibraryComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
