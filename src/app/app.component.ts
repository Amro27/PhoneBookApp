import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  users: any[]=[];
  userForm: boolean;
  isNewUser: boolean;
  newUser: any = {};
  editUserForm: boolean;
  editedUser: any = {};
  url: string = 'http://localhost:3000/api/contacts';

  constructor(private userService: UserService, private formBuilder: FormBuilder, public http: HttpClient) {
    // this.http.post('http://localhost:3000/api/contacts', {
    //   name: 'amr',
    //   number: '01115055052'
    // }).subscribe(res=>{
    //   console.log(res);
    // })
    this.getcontacts()
   }

  deletecontact(id) {
    this.http.delete(this.url + '/' + id).subscribe(()=>{
      this.getcontacts()
    })
  }

  getcontacts() {
    this.http.get(this.url).subscribe(users=>{
      this.users = users as any[];
      console.log(users);
    })
  }

  ngOnInit() {
    // this.users = this.getUsers();
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(11), Validators.pattern(/^[0-9]*$/)]],
      // lastName: ['', Validators.required, Validators.pattern(new RegExp("[0-9 ]{12}"))],
      // email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3),
        Validators.pattern(/^[A-z]*$/)]]
    });
  }

  onSubmit() {
    this.submitted = true;

    // stop the process here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    alert('SUCCESS!!');
  }

  getUsers(): User[] {
    return this.userService.getUsersFromData();
  }

  showEditUserForm(user: User) {
    if (!user) {
      this.userForm = false;
      return;
    }
    this.editUserForm = true;
    this.editedUser = user;
  }

  showAddUserForm() {
    // resets form if edited user
    if (this.users.length) {
      this.newUser = {};
    }
    this.userForm = true;
    this.isNewUser = true;

  }

  saveUser(user: User) {
    if (this.isNewUser) {
      // add a new user
      // this.userService.addUser(user);
      this.http.post(this.url, {
        name: user.Name,
        number: user.Number
      }).subscribe(res=>{
        console.log(res);
        this.getcontacts()
      })
      }
    this.userForm = false;
  }

  updateUser() {
    this.http.put(this.url+'/'+this.editedUser.id, {
      name: this.editedUser.Name,
      number: this.editedUser.Number
    }).subscribe(()=>{
      this.editUserForm = false;
      this.editedUser = {};
      this.getcontacts()
    })
    // this.userService.updateUser(this.editedUser);
    
  }

  removeUser(user: User) {
    this.userService.deleteUser(user);
  }

  cancelEdits() {
    this.editedUser = {};
    this.editUserForm = false;
  }

  cancelNewUser() {
    this.newUser = {};
    this.userForm = false;
  }

}
