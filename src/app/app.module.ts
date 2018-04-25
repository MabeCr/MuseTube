import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatSliderModule } from '@angular/material';

//Components
import { AppComponent } from './app.component';
import { PlayerControlsComponent } from './player-controls/player-controls.component';

//Services
import { SongLibraryComponent } from './song-library/song-library.component';
import { MinuteSecondsPipe } from './shared/minutes-seconds.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PlayerControlsComponent,
    SongLibraryComponent,
    MinuteSecondsPipe
  ],
  imports: [
    BrowserModule,
    MatButtonModule, 
    MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
