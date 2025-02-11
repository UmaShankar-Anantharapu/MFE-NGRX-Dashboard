import { Component, HostBinding } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { Observable, Subscription } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
// import { GET_DATASET, NEW_MESSAGE_SUBSCRIPTION } from './graphql/queries';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: { 'hostID': crypto.randomUUID().toString() }
})
export class AppComponent {
  selectedtheme!: string
  isLoggedIn: boolean = false;
  title = 'shell';
  subscription!: Subscription;
  constructor(private apollo: Apollo, public router: Router, public authService: AuthService) {
    this.authService.isLoggedIn$.subscribe((res: boolean) => {
      this.isLoggedIn = res
    })
  }
  ngOnInit() {
    let user = localStorage.getItem('user')
    if(user){
      this.authService.isLoggedIn.next(true);
    }else{
      this.authService.isLoggedIn.next(false)
    }
  }

  onThemeChange(event: string) {
    // console.log(event);
    this.selectedtheme = event
  }
  @HostBinding('class')
  get returnTheme() {
    return this.selectedtheme === 'light' ? 'light-theme' : 'dark-theme';
  }
  // getData(){
  //   this.getDataSet().subscribe((res: any) => {
  //     console.log(res);
  //   })
  //   this.apollo.watchQuery({query: GET_DATASET}).valueChanges.subscribe((res: any) => {
  //     console.log(res);
  //   })
  //   this.subscription = this.apollo
  //   .subscribe({
  //     query: NEW_MESSAGE_SUBSCRIPTION,
  //   })
  //   .subscribe(({ data }) => {
  //     if (data) {
  //       console.log(data)
  //     }
  //   });
  // }

  // getDataSet(): Observable<any> {
  //   return this.apollo.query({
  //     query: GET_DATASET,
  //     variables: {}
  //   })
  // }
}
