import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EventCalenderComponent } from '../../components/event-calender/event-calender.component';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    CalendarRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  declarations: [EventCalenderComponent, WrapperComponent]
})
export class CalendarModule { }
