import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WordsService } from '@services/words.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SopadeletrasComponent } from './components/sopadeletras/sopadeletras.component';

@NgModule({
  declarations: [AppComponent, SopadeletrasComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [WordsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
