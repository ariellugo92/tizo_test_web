import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { UserData } from '../users/interfaces/user-data.interface';
import { UserInfoService } from '../../shared/services/user-info.service';
import { ValidateRoleComponent } from "../../shared/components/permission/validate-role/validate-role.component";

@Component({
    selector: 'app-main',
    standalone: true,
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
    imports: [RouterModule, ValidateRoleComponent]
})
export class MainComponent implements OnInit {

  private readonly localStorageService = inject(LocalStorageService);
  private readonly userInfoService = inject(UserInfoService);

  userLogged?: Partial<UserData> | null;

  ngOnInit(): void {
    this.userInfoService.getUserLogged().subscribe(res => this.userLogged = res);
  }

  logout() {
    this.localStorageService.removeItem('token');
    window.location.href = '/auth/login';
  }

}
