import { ComponentType } from '@angular/cdk/portal';
import { AfterViewInit, Component, ContentChild, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { CanvasUtil } from '../utils/context';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ConnectionBottomsheetComponent } from './connection-bottomsheet/connection-bottomsheet.component';
import { ConnectionHandler } from './connection-handler';
import { ReceiverBottomsheetComponent } from './receiver-bottomsheet/receiver-bottomsheet.component';
import { Receiver, Sender } from './sender';
import { SenderBottomSheetComponent } from './sender-bottom-sheet/sender-bottom-sheet.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit, AfterViewInit {

  senders: Array<Sender> = [];

  receivers: Array<Receiver> = [];

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;
  bottomSheetRef: MatSnackBarRef<any>;
  connectionHandler: ConnectionHandler;

  setActive(sender: Sender, event: MouseEvent) {
    this.openSnackBar(sender, SenderBottomSheetComponent);
    this.connectionHandler.setAcvtiveSender(sender);
    event.stopPropagation();
  }

  constructor(private bottomSheet: MatBottomSheet, private snack: MatSnackBar) {

  }

  ngOnInit() {
    this.connectionHandler = new ConnectionHandler(this.senders, this.receivers, this.openSnackBar.bind(this));
    this.connectionHandler.randomize();

  }

  ngAfterViewInit() {
    this.connectionHandler.setCanvas(this.canvas.nativeElement);
  }

  receiverClick(item: Receiver) {
    if (this.connectionHandler.addConnection(item)) {
      this.connectionHandler.drawConnections();
    }
    this.openSnackBar(item);
  }

  senderAddClick(sender: Sender) {
    this.connectionHandler.startAdd(sender);
  }

  wrapperClick() {
    this.connectionHandler.reset();
    if (this.bottomSheetRef) {
      this.bottomSheetRef.dismiss();
      this.bottomSheetRef = undefined;
    }
  }
  openSnackBar(config, type: ComponentType<any> = ReceiverBottomsheetComponent) {
    if (this.bottomSheetRef) {
      this.bottomSheetRef.dismiss();
    }

    this.bottomSheetRef = this.snack.openFromComponent(type, {
      data: config,
    });
  }
}
