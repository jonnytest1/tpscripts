import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Connection, Receiver, Sender } from '../interfaces';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.less']
})
export class ConfigurationComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: Receiver | Connection | Sender,
    private snackbarRef: MatSnackBarRef<any>) { }


  dismiss() {
    this.snackbarRef.dismiss();
  }

  ngOnInit() {
  }

}
