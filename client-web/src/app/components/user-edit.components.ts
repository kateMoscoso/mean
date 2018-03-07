import { Component, OnInit} from '@angular/core';
import { GLOBAL} from '../services/global';
import { UserService } from '../services/user.services';
import { User } from '../models/user';

@Component({
    selector:'user-edit',
    templateUrl : '../views/user-edit.html',
    providers: [UserService]
})
 export class UserEditComponent implements OnInit{
     public titulo: string;
     public user: User;
     public identity;
     public token;
     public alertMessage;
     public url: String;

     constructor(
         private _userService : UserService
     ){
        this.titulo = 'Actualizar mis datos';

        this.identity =this._userService.getIdentity();
        this.token = this._userService.getToken(); 
        this.user = this.identity;
        this.url = GLOBAL.url;

     }
     ngOnInit(){
         console.log('user-edit.component.ts cargado');
      
     }
     onsubmit(){
         console.log(this.user);
         this._userService.updateUser(this.user).subscribe(
             response =>{
                if(!response.user){
                    this.alertMessage = 'User not updated';
                }
                else {
                    //this.user = response.user;
                    localStorage.setItem('identity',JSON.stringify(this.user));
                    document.getElementById("identity_name").innerHTML = this.user.name;
                    if(!this.filesToUpload){

                    }else{
                        this.makeFileRequest(this.url +'upload-image-user/' +this.user
                        ._id,[],this.filesToUpload).then(
                            ( result:any)=>{
                            this.user.image = result.image;
                            localStorage.setItem('identity',JSON.stringify(this.user));
                            console.log(this.user);
                            let imagePath =this.url + 'get-image-user/'+this.user.image;
                            document.getElementById('image-logged').setAttribute('src', imagePath);
                        });
                    }
                    this.alertMessage = 'User updated';
                }
             },
             error => {
                 var errorMessage = <any> error;
                 if(errorMessage != null){
                     var body =JSON.parse(error._body);
                     this.alertMessage = body.message;
                     console.log(error);

                 }
             }
         );
     }

     public filesToUpload: Array<File>;

     fileChaneEvent(fileInput: any){
         this.filesToUpload = <Array<File>> fileInput.target.files;
     }
     makeFileRequest( url: string, params: Array<string>, files: Array<File>){
         var token = this.token;
         return new Promise(function(resolve, reject){
             var formData : any = new FormData();
             var xhr = new  XMLHttpRequest();

             for(var i = 0 ; i <files.length; i ++){
                 formData.appen('image', files[i], files[i].name);
             }
             xhr.onreadystatechange = function(){
                 if(xhr.readyState == 4){
                     if(xhr.status === 200){
                        resolve(JSON.parse(xhr.response));
                     }
                     else{
                         reject(xhr.response);
                     }
                 }
                
             }
             xhr.open('POST', url, true);
             xhr.setRequestHeader('Authorization',token);
             xhr.send(formData);
         })
     }
 }