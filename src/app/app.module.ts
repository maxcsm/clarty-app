import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, IonModal } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationService } from 'src/providers/authentication.service';
import { AuthGuard } from 'src/providers/auth-guard.service';
//import { StorageService } from 'src/providers/storage';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { RedditService } from 'src/providers/reddit-service';
import { TokenInterceptor } from 'src/providers/auth.token.interceptor';
import { Storage } from '@ionic/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocalService } from 'src/providers/local.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SignInWithApple } from '@awesome-cordova-plugins/sign-in-with-apple/ngx';

import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    BrowserModule,
    IonicModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    //Deeplinks,
    //GooglePlus,
    SpeechRecognition,
    SignInWithApple,
    Storage,
    RedditService,
    AuthenticationService,
    AuthGuard,
    IonModal,
    LocalService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    }
  

  
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
