import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.services';
import { User } from './models/user';
import { GLOBAL} from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit {
  public title = 'Music Rock!';
  public user : User;
  public user_register : User;
  public identity ;
  public token;
  public errorMessage;
  public alertRegister;
  public url: string;


  constructor(
    private _userService : UserService
  ){
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
    this.url = GLOBAL.url;

  }
  ngOnInit(){
    this.identity =this._userService.getIdentity();
    this.token = this._userService.getToken();
    console.log(this.identity);
    console.log(this.token);
  }
  public onSubmit(){
    console.log(this.user);
    this._userService.signup(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;
        if(!this.identity._id){
          alert("Not loger user");
        }
        else {
          localStorage.setItem('identity',JSON.stringify(identity))
               this._userService.signup(this.user, 'true').subscribe(
           response => {
             let token = response.token;
             this.token = token;
             if(this.token.length <= 0){
               alert("Token  not generated");
             }
             else {
                  localStorage.setItem('token',token)
                  this.user = new User('','','','','','ROLE_USER','');


             }
             console.log(response)
           },
           error => {
             var errorMessage = <any>error;
             if(errorMessage != null){
               var body = JSON.parse(error._body);
               this.errorMessage = body.message;
               console.log(error);
             }
           }
         )
        }
        console.log(response)
      },
      error => {
        var errorMessage = <any>error;
        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    )
  }
  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('storage');
    localStorage.clear();
    this.identity=null;
    this.token = null;
  }
  onSubmitRegister(){
    console.log(this.user_register);
    this._userService.register(this.user_register).subscribe(
      response =>{
        let user = response.user;
        this.user_register = user;
        if(!user._id){
         this.alertRegister = 'Error al registrarse';
        }
        else {
          this.alertRegister = 'Registro correcto';
          this.user_register = new User('','','','','','ROLE_USER','');
        }

      },
      error => {
        var errorMessage = <any>error;
        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
          console.log(error);
        }
      }
    )
  }
}
