import { Component, OnInit } from '@angular/core';
import { Artist } from 'src/app/classes/artist';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { ref } from '@angular/fire/database';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DocumentData } from '@angular/fire/firestore';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss']
})
export class FeaturedComponent implements OnInit{
  User!: Artist;

  fileUploads: DocumentData[] = []

  constructor(public upload: FileUploadService, public auth:AuthService, public http: HttpClient){}

  // userUid = JSON.parse(localStorage['user']);
  // uid = this.userUid[Object.keys(this.userUid)[0]];


  // userDb = ref(this.auth.database, `users/  ${this.uid}`);

  // getUser() {
  //   console.log(this.uid);
  //   return this.http.get<Artist>(
  //     `https://glimm-6e33c-default-rtdb.europe-west1.firebasedatabase.app/users/${this.uid}.json?auth=${environment.firebase.apiKey}`
  //     );
  // }

  // ngOnInit(){
  //   this.getUser().subscribe((user) => {
  //     this.User = user
  //     this.upload.getWork(this.User).subscribe(fileUploads => {
  //       this.fileUploads = fileUploads;
  //       console.log(this.fileUploads);
  //   })
  // })
  // }

  ngOnInit() {
    this.upload.getWork().subscribe((data) => {
      this.fileUploads = data
      // this.fileUploads = fileUploads['sort']((a: { [x: string]: number; }, b: { [x: string]: number; }) => b['timestamp'] - a['timestamp'])
    })
  }

}
