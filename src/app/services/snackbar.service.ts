import { TranslocoService } from '@jsverse/transloco';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    private translocoService: TranslocoService,
    private matSnackBar: MatSnackBar
  ) {}

  success(message: string, duration = 5000) {
    this.translocoService.selectTranslate(message).subscribe((translation) => {
      this.matSnackBar.open(translation, 'X', {
        duration: duration,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        panelClass: 'successSnackbar',
        politeness: 'assertive',
      });
    });
  }
  error(message: string, duration = 8000) {
    this.translocoService.selectTranslate(message).subscribe((translation) => {
      this.matSnackBar.open(translation, 'X', {
        duration: duration,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        panelClass: 'errorSnackbar',
        politeness: 'assertive',
      });
    });
  }
}
