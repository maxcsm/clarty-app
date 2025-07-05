import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LocalService } from "./local.service";

@Injectable({
providedIn: 'root'
})
export class TranslateConfigService {
constructor(
private translate: TranslateService,
private localStore: LocalService
) { }



getDefaultLanguage(){
let language = this.translate.getBrowserLang();
//this.translate.setDefaultLang(language);
return language;
}

setLanguage(setLang: string) {
this.translate.use(setLang);
 this.localStore.saveItem('lang',setLang);
}


getCurrentLang() {
return this.localStore.getItem('lang');
}
}