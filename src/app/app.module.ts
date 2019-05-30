// angular
import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { CommonModule , APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// angular-material
//import {MatButtonModule} from '@angular/material/button';
// prime-face
// import { 
//   ButtonModule
// } from 'primeng/primeng';
// Semantic UI
import { SuiModule } from 'ng2-semantic-ui';

// flow
import { TInjector1, MSignal, MActions, MInteractions, MStates, MSelectors, MUIEvents, Managers } from '../flow/core/fl-core';
import { StateManager } from '../flow/model-manager/fl-model';
import { ALoger } from '../flow/loger/loger';

// app
import { AppTests } from './ngt-mechanics/ngt-tests';
import { Interactions } from './ngt-mechanics/ngt-interactions';
import { Reducers } from './ngt-mechanics/ngt-redukce';
import { Selectors } from './ngt-mechanics/ngt-sel';
import { States } from './ngt-mechanics/ngt-states';
import { UIEvents } from './ngt-mechanics/ngt-ui';
import { Mock } from './ngt-mechanics/ngt-mocks';
import { Operators } from './ngt-mechanics/ngt-operators';
import { JwtService, ApiService, ServerAPI, ServerAPIMock } from './ngt-mechanics/ngt-server';
// app - visual
import { 
  NGTimerInj,
  AppComponent, WPageAuth, WLoger, WLogIn, WSignIn, WMainPrehled, WPrehledItems, WPrehledItemsHeader,
  WItemEditor, WTaskItem, WTaskGroupItem, WTimeCounter,
} from './components/app/app.component';

const appRoutes: Routes = [
  //{ path: 'pages', loadChildren: 'app/mechanics/modules#PagesModule' },

  // { path: 'pages', component: CompC,
  //   children: [
  //     { path: 'a/cB' , component:  CompB },
  //   ]
  // },

  // {
  //   path: 'w-main-container/w-page-log-in/v-log-in',
  //   component: WPageLogin,
  // },
  // {
  //   path: 'w-main-container/w-page-log-in/v-sign-in',
  //   component: WPageLogin,
  // },
  // { path: '', redirectTo: 'w-main-container/w-page-log-in/v-log-in', pathMatch: 'full' },
  // { path: '**', redirectTo: 'w-main-container/w-page-log-in/v-log-in' },
  // { path: 'auth/login', component: WPageLogin, },
  // {
  //   path: 'auth',
  //   component: WPageLogin,
  //   // children: [
  //   //   {
  //   //     path: '',
  //   //     component: NbLoginComponent,
  //   //   },
  //   //   {
  //   //     path: 'login',
  //   //     component: NbLoginComponent,
  //   //   }
  //   // ],
  // },
  //{ path: '', redirectTo: 'pages/w-app-planer/w-structure-tasks-project/5c1a45237ed4b22f106cb965', pathMatch: 'full' },
  //{ path: '', redirectTo: 'auth', pathMatch: 'full' },
  // { path: '', redirectTo: 'cA', pathMatch: 'full' },
  //{ path: '', redirectTo: 'pages/w-app-planer/w-time-view/v-today', pathMatch: 'full' },
  //{ path: '**', redirectTo: 'pages' },
];

// const config: ExtraOptions = {
//   useHash: true,
// };

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}

@NgModule({
  imports: [
    // angular
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    // ang-mat
    // MatButtonModule
    
    // ang-primeFace
    //ButtonModule,
    // SemUI
    SuiModule
  ],
  declarations: [
    AppComponent,
    WPageAuth, 
    WLoger, 
    WLogIn, 
    WSignIn, 
    WMainPrehled, 
    WPrehledItems, 
    WPrehledItemsHeader,
    WItemEditor, 
    WTaskItem, 
    WTaskGroupItem, 
    WTimeCounter
  ],
  bootstrap: [AppComponent],
  providers: [
    //{ provide: APP_BASE_HREF, useValue: '/' },
    // flow
    TInjector1,
    MSignal,
    StateManager,
    MActions,
    MInteractions,
    MStates,
    MSelectors,
    MUIEvents,
    Managers,
    ALoger,

    // < App
    Mock,
    Operators,  
    JwtService, 
    ApiService, 
    ServerAPIMock,
    ServerAPI,

    NGTimerInj,
    
    AppTests,
    Interactions,
    Reducers,
    Selectors,
    States,
    UIEvents
  ],
})
export class AppModule {
}