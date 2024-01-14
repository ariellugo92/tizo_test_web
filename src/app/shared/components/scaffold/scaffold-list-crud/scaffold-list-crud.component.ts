import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Table, TableModule } from "primeng/table";
import { ValidateRoleComponent } from "../../permission/validate-role/validate-role.component";

export interface TableData {
  header: string,
  field: string,
}

@Component({
    selector: 'app-scaffold-list-crud',
    standalone: true,
    templateUrl: './scaffold-list-crud.component.html',
    styleUrl: './scaffold-list-crud.component.scss',
    imports: [TableModule, ValidateRoleComponent]
})
export class ScaffoldListCrudComponent {

  @Input({required: true}) title!: string;
  @Input({required: true}) columns!: TableData[];
  @Input({required: true}) data!: any[];

  @Output() addItem = new EventEmitter<boolean>();
  @Output() editItem = new EventEmitter<any>();

  clear(table: Table) {
    table.clear();
  }

  onAddItem() {
    this.addItem.emit(true);
  }

  onEditItem(data: any) {
    this.editItem.emit(data);
  }
}
