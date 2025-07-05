import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LocalService } from 'src/providers/local.service';
import { RedditService } from 'src/providers/reddit-service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  table: string="locations";
  category:any="";
  id: any;
  pages: any;
  items: any;
  posts: any;
  page:number =1;
  status:any="";
  filter:string="";
  wordid: any="";
  total:number=0;
  last_page:number=0;
  per_page:number=20;
  order_id:any="id";
  order_by:any="desc";
  iduser: any;
  constructor ( public navCtrl: NavController, 
      public redditService:RedditService, 
      private router: Router,  
      private localStore: LocalService,
    ) {}
      


  getLasTAssitant() {
    this.iduser = this.localStore.getItem('iduser');
  this.redditService.getDataBypageByUser(this.iduser,this.page,"assitantsByUser",this.per_page,this.order_id,this.order_by,this.category,this.status,this.filter).subscribe(data => {
    console.log(data);
 
    console.log(data.total); 
    if(data.total==0){
      console.log("---------PAS DE CHAT ------"); 
      this.router.navigateByUrl('/tabs/chat');

    } else {

      this.posts=data.data;
      this.posts[0].id
      this.router.navigateByUrl('/tabs/chat-doc/'+this.posts[0].id);
    }

 
  })
}  

}
