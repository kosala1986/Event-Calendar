import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EventCalendarComponent } from '../../components/event-calendar/event-calendar.component';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    CalendarRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  declarations: [EventCalendarComponent, WrapperComponent]
})
export class CalendarModule { }
