import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { Observable, Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { GET_DATASET, NEW_MESSAGE_SUBSCRIPTION } from './graphql/queries';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: { 'hostID': crypto.randomUUID().toString() }
})
export class AppComponent {
  title = 'shell';
  subscription!:Subscription;
  constructor(private apollo: Apollo){}
  ngOnInit() {
    this.getData()
  }

  getData(){
    this.getDataSet().subscribe((res: any) => {
      console.log(res);
    })
    this.apollo.watchQuery({query: GET_DATASET}).valueChanges.subscribe((res: any) => {
      console.log(res);
    })
    this.subscription = this.apollo
    .subscribe({
      query: NEW_MESSAGE_SUBSCRIPTION,
    })
    .subscribe(({ data }) => {
      if (data) {
        console.log(data)
      }
    });
  }

  getDataSet(): Observable<any> {
    return this.apollo.query({
      query: GET_DATASET,
      variables: {}
    })
  }
}
