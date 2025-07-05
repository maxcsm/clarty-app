import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class LocalService {
  constructor() { }
  public saveItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }
  public getItem(key: string) {
    return localStorage.getItem(key)
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
  }
  public clearData() {
    localStorage.clear();
  }
}