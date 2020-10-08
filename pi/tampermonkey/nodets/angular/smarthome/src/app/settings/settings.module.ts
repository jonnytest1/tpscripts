import { NgModule } from '@angular/core';

import { SettingsComponent } from './settings.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { SenderBottomSheetComponent } from './sender-bottom-sheet/sender-bottom-sheet.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReceiverBottomsheetComponent } from './receiver-bottomsheet/receiver-bottomsheet.component';
import { ConnectionBottomsheetComponent } from './connection-bottomsheet/connection-bottomsheet.component';
@NgModule({
    declarations: [
        SettingsComponent,
        ConnectionBottomsheetComponent,
        SenderBottomSheetComponent,
        ReceiverBottomsheetComponent
    ],
    imports: [
        CommonModule,
        MatListModule,
        MatIconModule,
        MatCardModule,
        MatBottomSheetModule,
        MatSnackBarModule
    ],
    providers: [],
    bootstrap: []
})
export class SettingsModule { }
