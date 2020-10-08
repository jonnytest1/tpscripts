import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Sender } from '../sender';

@Component({
  selector: 'app-sender-bottom-sheet',
  templateUrl: './sender-bottom-sheet.component.html',
  styleUrls: ['./sender-bottom-sheet.component.less']
})
export class SenderBottomSheetComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: Sender,
    private snackbarRef: MatSnackBarRef<any>) { }

  ngOnInit() {
  }

}
