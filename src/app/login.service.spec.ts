import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.dev";

@Injectable({
  providedIn: "root",
})
export class MyService {
  constructor(private http: HttpClient) {}

  getData(): Observable<HttpResponse<any>> {
    const apiURL = environment.apiURL;
    return this.http.post<any>(
      apiURL + "/api/token/",
      {
        username: "admin1",
        password: "admin",
      },
      { observe: "response" }
    );
  }
}
