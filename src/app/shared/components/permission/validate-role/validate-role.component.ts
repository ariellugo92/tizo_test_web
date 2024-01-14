import { Component, Input, OnInit, inject } from '@angular/core';
import { UserInfoService } from '../../../services/user-info.service';
import { SkeletonModule } from "primeng/skeleton";

@Component({
  selector: 'app-validate-role',
  standalone: true,
  imports: [
    SkeletonModule,
  ],
  templateUrl: './validate-role.component.html',
  styleUrl: './validate-role.component.scss'
})
export class ValidateRoleComponent implements OnInit {

  private readonly userInfoService = inject(UserInfoService);

  @Input({required: true}) role!: string;

  hasAccess: boolean = false;
  loading: boolean = true;

  ngOnInit(): void {
    this.loading = true;
    this.userInfoService.getUserLogged().subscribe(res => {
      this.hasAccess = (res && (res.role == this.role)) ?? false;
      this.loading = false;
    });
  }

}
