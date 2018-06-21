import { Component } from '@angular/core';
import { EditableComponent } from './editable.component';

@Component({
  selector: 'syndesis-editable-text',
  template: `
    <div class="form-control-pf-editable"
      [ngClass]="{'form-control-pf-edit': editing}">

      <ng-template [ngIf]="!editing">
        <button class="form-control-pf-value" (click)="editing = true">
          <em class="text-muted" *ngIf="!value">
            {{ placeholder }}
          </em>
          <ng-container *ngIf="value">
            {{ value }}
          </ng-container>
          <i class="glyphicon glyphicon-pencil" aria-hidden="true"></i>
        </button>
      </ng-template>

      <ng-template [ngIf]="editing">
        <div class="form-control-pf-textbox">
          <div [ngClass]="{'has-error': errorMessage}">
            <input #textInput type="text" class="form-control form-control-pf-editor" [ngModel]="value">
          </div>
          <button type="button"
          class="form-control-pf-empty"
          aria-label="Clear Value"
          (click)="textInput.value = ''">
            <span class="fa fa-times-circle fa-lg"></span>
          </button>
        </div>
        <button type="button"
          class="btn btn-primary form-control-pf-save"
          aria-label="Save"
          (click)="submit(textInput.value.trim())">
          <i class="glyphicon glyphicon-ok"></i>
        </button>
        <button type="button"
          class="btn btn-default form-control-pf-cancel"
          aria-label="Cancel"
          (click)="cancel()">
          <i class="glyphicon glyphicon-remove"></i>
        </button>
      </ng-template>
    </div>
    <div class="has-error" *ngIf="errorMessage">
      <span class="help-block">{{ errorMessage }}</span>
    </div>
  `,
  styles: [`
    .form-control {
      font-size: inherit;
      height: inherit;
      line-height: inherit;
    }
  `]
})
export class EditableTextComponent extends EditableComponent {


}
