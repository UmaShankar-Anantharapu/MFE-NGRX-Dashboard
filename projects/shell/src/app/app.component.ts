import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { Apollo } from 'apollo-angular';
import { GET_DATASET } from './graphQl/dataset.queries';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: { 'hostID': crypto.randomUUID().toString() }
})
export class AppComponent implements OnInit {
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
  }
  
  getDataSet(): Observable<any> {
    return this.apollo.query({
      query: GET_DATASET,
      variables: {}
    })
  }
  title = 'shell';
}
