import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { UserService } from './modules/users/services/user.service';
import { UserInfoService } from './shared/services/user-info.service';
import { Subject, takeUntil } from 'rxjs';
import { LocalStorageService } from './shared/services/local-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    ConfirmDialogModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  private readonly userService = inject(UserService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly userInfoService = inject(UserInfoService);

  private destroy$ = new Subject();

  title = 'tizo_test';

  ngOnInit(): void {
    this.setUser();
  }

  setUser() {
    if (!this.localStorageService.getItem('token')) return;
    this.userInfoService
      .getUserLogged()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (!res) this.loadUserLogged();
        }
    });
  }

  loadUserLogged() {
    this.userService
      .my()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res) this.userInfoService.setUserLogged(res);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
