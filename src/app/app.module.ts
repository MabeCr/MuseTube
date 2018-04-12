import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Components
import { AppComponent } from './app.component';
import { PlayerControlsComponent } from './player-controls/player-controls.component';

//Services
import { UrlService } from './services/url/url.service';

@NgModule({
  declarations: [
    AppComponent,
    PlayerControlsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [UrlService],
  bootstrap: [AppComponent]
})
export class AppModule { }
