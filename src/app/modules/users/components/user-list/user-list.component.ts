import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ScaffoldListCrudComponent, TableData } from "../../../../shared/components/scaffold/scaffold-list-crud/scaffold-list-crud.component";
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { UserData } from '../../interfaces/user-data.interface';

@Component({
    selector: 'app-user-list',
    standalone: true,
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss',
    imports: [ScaffoldListCrudComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit, OnDestroy {

  private readonly router = inject(Router);
  private readonly detectorRef = inject(ChangeDetectorRef);
  private readonly userService = inject(UserService);

  private destroy$ = new Subject();

  columns: TableData[] = [
    {header: 'Usuario', field: 'username'},
    {header: 'Rol', field: 'role'},
    {header: 'Estado', field: 'status'},
  ];

  users: Partial<UserData>[] = [];

  ngOnInit(): void {
      this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.users = res.map(user => ({...user, status: user.status ? 'Activo' : 'Inactivo'}));
        this.detectorRef.detectChanges();
      }
    });
  }

  addItem() {
    this.router.navigate(['/users/new']);
  }

  editItem(data: UserData) {
    this.router.navigate(['/users/edit', data._id]);
  }

  ngOnDestroy(): void {
      this.destroy$.complete();
      this.destroy$.unsubscribe();
  }

}
