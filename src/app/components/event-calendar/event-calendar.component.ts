import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validator, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Event } from '../../models/event.model';
import * as _ from 'underscore';

@Component({
  selector: 'event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss']
})
export class EventCalendarComponent implements OnInit {

  eventList: Array<Event> = [
    { id: "New", start: 60, end: 120 },
    { id: "New 1", start: 150, end: 270 },
    { id: "New 2", start: 240, end: 300 },
    { id: "New 3", start: 200, end: 360 },
    { id: "New 4", start: 180, end: 330 }
  ];
  totalWidth: number = 600;
  totalHeight: number = 1440;
  hoursList: Array<object> = [
    { id: 0, label: '9.00', value: 0 },
    { id: 1, label: '10.00', value: 60 },
    { id: 2, label: '11.00', value: 120 },
    { id: 3, label: '12.00', value: 180 },
    { id: 4, label: '1.00', value: 240 },
    { id: 5, label: '2.00', value: 300 },
    { id: 6, label: '3.00', value: 360 },
    { id: 7, label: '4.00 ', value: 420 },
    { id: 8, label: '5.00', value: 480 },
    { id: 9, label: '6.00', value: 540 },
    { id: 10, label: '7.00 ', value: 600 },
    { id: 11, label: '8.00', value: 660 },
    { id: 12, label: '9.00', value: 720 }
  ];

  eventForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.eventFormInit();
    this.calcEventPotition(this.eventList);
  }

  /** 
   * Calculate position of the event on the calender.
   */
  calcEventPotition(eventList: Array<Event>): Array<Event> {

    eventList.forEach((eleOne: Event, evtKeyOne: number) => {
      let width_divider: number = 0,
        parallelObjArray = eventList.filter(eleTwo => eleOne['end'] >= eleTwo['start'] && eleOne['start'] <= eleTwo['end']);

      eleOne['width'] = (this.totalWidth / (parallelObjArray.length || 1));

      let positionx: number = this.totalWidth;
      parallelObjArray.forEach((ele: Event) => {
        positionx = positionx - eleOne['width'];
        ele['left'] = positionx;
      });

      eleOne['height'] = (eleOne['end'] - eleOne['start']) * 2;
      eleOne['top'] = eleOne['start'] * 2;
    });
    return eventList;
  }

  setStyle(event: object): object {
    let styleObj: object = {};
    styleObj = { 'height': `${event['height']}px;`, 'bottom': `${event['top']}px;`, 'width': `${event['width']}px;` };
    return styleObj;
  }

  eventFormInit(): void {
    this.eventForm = this.formBuilder.group({
      eventName: ['', [Validators.required, Validators.maxLength(10)]],
      eventStartTime: ['', [Validators.required]],
      eventEndTime: ['', [Validators.required]]
    });
  }

  /** 
   * Add a new event to calender.
   */
  addEvent(): void {
    if (this.isFormValid()) {
      let newEvent: Event = {
        id: (this.eventForm.controls['eventName'].value).trim(),
        start: parseInt(this.eventForm.controls['eventStartTime'].value),
        end: parseInt(this.eventForm.controls['eventEndTime'].value)
      };
      if (_.where(this.eventList, newEvent).length) {
        alert('Your event is already there, Please add a new event.');
        this.eventForm.reset();
      } else {
        this.eventList.push(newEvent);
        this.calcEventPotition(this.eventList);
        this.eventForm.reset();
        alert('Your new event has been added!');
      }

    }
  }
  /** 
   * Check whether event is valid
   */
  isFormValid(): boolean {
    return this.eventForm.valid && (parseInt(this.eventForm.controls['eventStartTime'].value) < parseInt(this.eventForm.controls['eventEndTime'].value));
  }


}

