import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordsService {
  constructor(public _http: HttpClient) {}

  getRamdomWord(): Observable<any> {
    return this._http.get(
      'https://palabras-aleatorias-public-api.herokuapp.com/random'
    );
  }
}
