import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ValidateRoleComponent } from "../../permission/validate-role/validate-role.component";

@Component({
    selector: 'app-scaffold-form-crud',
    standalone: true,
    templateUrl: './scaffold-form-crud.component.html',
    styleUrl: './scaffold-form-crud.component.scss',
    imports: [ValidateRoleComponent]
})
export class ScaffoldFormCrudComponent {
  @Input({required: true}) title!: string;
  @Input({required: true}) labelManage!: string;
  @Input() deleteVisible: boolean = false;
  @Input() isActive: boolean = true;

  @Output() manageData = new EventEmitter<any>();
  @Output() deleteData = new EventEmitter<any>();
  @Output() cancelData = new EventEmitter<any>();

  onManageData() {
    this.manageData.emit();
  }

  onDeleteData() {
    this.deleteData.emit();
  }

  onCancelData() {
    this.cancelData.emit();
  }
}
