import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertCardsComponent } from './insert-cards.component';

describe('InsertCardsComponent', () => {
  let component: InsertCardsComponent;
  let fixture: ComponentFixture<InsertCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsertCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
