import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Connection } from '../interfaces';

@Component({
  selector: 'app-connection-bottomsheet',
  templateUrl: './connection-bottomsheet.component.html',
  styleUrls: ['./connection-bottomsheet.component.less']
})
export class ConnectionBottomsheetComponent implements OnInit {

  title$ = new Subject<string>();

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: Connection,
    private snackbarRef: MatSnackBarRef<any>) {

    fetch(environment.prefixPath + 'rest/connection/key?itemRef=' + data.id)
      .then(r => r.json())
      .then(keys => {
        this.title$.next(`context: ${keys.join(', ')}`);
      });



  }


  ngOnInit() {
  }

}
