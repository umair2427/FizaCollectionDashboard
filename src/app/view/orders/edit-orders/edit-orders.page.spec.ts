import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditOrdersPage } from './edit-orders.page';

describe('EditOrdersPage', () => {
  let component: EditOrdersPage;
  let fixture: ComponentFixture<EditOrdersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
