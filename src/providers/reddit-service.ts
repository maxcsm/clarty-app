import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError, Observable, } from 'rxjs';
import { retry, } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AlertController, ToastController } from '@ionic/angular';
import { LocalService } from './local.service';


@Injectable()
export class RedditService {


  URLbase = "https://api1.XXXXXXX/api/";
  URLImage = "https://api1.XXXXXXXXXXX/images/";

  
  language: string = "EN";
  exp: any;
  token: any;

  email: any;
  alertmsg: any;
  alertmessage: any;


  constructor(
    public http: HttpClient, 
    public alertController: AlertController,
    public toastCtrl: ToastController,
    private localStore: LocalService
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
     'Content-Type': 'application/json',
  })}

  httpOption2 = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
  })}


  ngOnInit() { }

  login(data: any): Observable<any> {
    return this.http
      .post<any>(this.URLbase +'login', data, this.httpOptions)
     .pipe(retry(2), catchError(this.handleError))
  }

  register(data: any): Observable<any> {
    return this.http
      .post<any>(this.URLbase + 'register', data, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError))
  }

  registersocial(data: any): Observable<any> {
    return this.http
      .post<any>(this.URLbase + 'registersocial', data, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError))
  }

  forgetpassword(data: string): Observable<any> {
    return this.http
      .post<any>(this.URLbase +'forgotpassword',data,this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }
  
  adduser(data: any): Observable<any> {
    return this.http
      .post<any>(this.URLbase+'adduser',data,this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }
  

  checkWord(table: string,data: any): Observable<any> {
    return this.http
      .post<any>(this.URLbase +table,data,this.httpOption2)
      .pipe(retry(2),catchError(this.handleError))
  }




  postByid(table: string,id: string): Observable<any> {
    return this.http
      .get<any>(this.URLbase+table+'/'+id,this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }
  
  addPost(table: string,data: string): Observable<any> {
    return this.http
      .post<any>(this.URLbase+table,data,this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }
  
  update(table: string,id: string, data: any): Observable<any> {
    return this.http
      .put<any>(this.URLbase+table+'/'+id,data,this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }
  

  updateinvoice(table: string,id: string, data: any): Observable<any> {
    return this.http
      .post<any>(this.URLbase+table+'/'+id,data,this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }


  delete(table: string,id: string): Observable<any> {
    return this.http
      .delete<any>(this.URLbase+table+'/'+id,this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }

  sendByid(table: string,id: string): Observable<any> {
    return this.http
      .post<any>(this.URLbase+table+'/'+id,this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }

  getDataBypage(page: string | number, table: string, per_page: string | number, order_id: string, order_by: string, category: string | number, status: string | number, filter: string): Observable<any> {
    return this.http
      .get<any>(this.URLbase + table + '?page=' + page + '&per_page=' + per_page + '&order_id=' + order_id + '&order_by=' + order_by + '&category=' + category+'&status=' + status+  '&filter=' + filter)
      .pipe(retry(2), catchError(this.handleError))
  }


  getDataBypageCalendar(page: string, table: string, per_page: string | number,startdate: string,enddate: string,priority: string | boolean, filter: string): Observable<any> {
    return this.http
      .get<any>(this.URLbase + table + '?page=' + page + '&size=' + per_page +'&startDate=' +startdate+'&endDate=' +enddate+'&active='+priority+'&filter='+filter)
      .pipe(retry(2), catchError(this.handleError))
  }
  
  

  getDataAll(table: string): Observable<any> {
    return this.http
      .get<any>(this.URLbase + table)
      .pipe(retry(2), catchError(this.handleError))
  }


  getByid(table: string,id: number): Observable<any> {
    return this.http
      .get<any>(this.URLbase+table+'/'+id,this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }
  
  
  updateByid(table: string, data: any): Observable<any> {
    return this.http
      .post<any>(this.URLbase+table,data,this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }


  uploadImage(table: string,data: FormData): Observable<any> {
    return this.http
      .post<any>(this.URLbase+table,data,this.httpOptions)
      .pipe(retry(2),catchError(this.handleError))
  }
  
 

  getMessagesBythread(thread: string): Observable<any> {
    return this.http
      .get<any>(this.URLbase+'public_chatgpt/'+thread)
      .pipe(retry(2),catchError(this.handleError))
  }

  getDataBypageByUser(id:number, page: string | number, table: string, per_page: string | number, order_id: string, order_by: string, category: string | number, status: string | number, filter: string): Observable<any> {
    return this.http
      .get<any>(this.URLbase + table +'/'+id+'?page=' + page + '&per_page=' + per_page + '&order_id=' + order_id + '&order_by=' + order_by + '&category=' + category+'&status=' + status+  '&filter=' + filter)
      .pipe(retry(2), catchError(this.handleError))
  }

  getUrlBase() {
    return this.URLbase;
  }
  

  getUrlImage() {
    return this.URLImage;
  }
///////////LOG 

/** Log a HeroService message with the MessageService */
private log(message: string) {
  console.log(message);
}
// Handle API errors
  async handleError(error: HttpErrorResponse) {


    console.log(error);
   // alert(error.error[0].message);
   
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.

    
    console.error('An error occurred:', error.message);



  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // return an observable with a user-facing error message
 // return throwError(
  //  'Something bad happened; please try again later.');
};





}