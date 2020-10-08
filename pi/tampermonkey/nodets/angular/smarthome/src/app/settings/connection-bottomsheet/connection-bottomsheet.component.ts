import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Connection } from '../sender';

@Component({
  selector: 'app-connection-bottomsheet',
  templateUrl: './connection-bottomsheet.component.html',
  styleUrls: ['./connection-bottomsheet.component.less']
})
export class ConnectionBottomsheetComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: Connection,
    private snackbarRef: MatSnackBarRef<any>) { }


  ngOnInit() {
  }

}
