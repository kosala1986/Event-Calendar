import { Component, OnInit } from '@angular/core';
import * as _ from 'underscore';

@Component({
  selector: 'event-calender',
  templateUrl: './event-calender.component.html',
  styleUrls: ['./event-calender.component.scss']
})
export class EventCalenderComponent implements OnInit {

  eventList: Array<object> = [
    { id: "New", start: 60, end: 120 },
    { id: "New 1", start: 150, end: 270 },
    { id: "New 2", start: 240, end: 300 },
    { id: "New 3", start: 200, end: 360 },
    { id: "New 4", start: 180, end: 330 },
    { id: "New 5", start: 420, end:  480},
  ];
  totalWidth: number = 600;
  totalHeight: number = 1440;
  hoursList: Array<object> = [
    { id: 0, label: '9.00' },
    { id: 1, label: '10.00' },
    { id: 2, label: '11.00' },
    { id: 3, label: '12.00' },
    { id: 4, label: '1.00' },
    { id: 5, label: '2.00' },
    { id: 6, label: '3.00' },
    { id: 7, label: '4.00 ' },
    { id: 8, label: '5.00' },
    { id: 9, label: '6.00' },
    { id: 10, label: '7.00 ' },
    { id: 11, label: '8.00' },
    { id: 12, label: '9.00' }
  ];

  constructor() { }

  ngOnInit(): void {
    this.calEventPotitions(this.eventList);
  }

  calEventPotitions(eventList: Array<object>): Array<object> {

    let positionX: number = this.totalWidth;
    eventList.forEach((eleOne: object, evtKeyOne: number) => {
      let width_divider: number = 0,
      parallelObjArray = eventList.filter(eleTwo => eleOne['end'] >= eleTwo['start'] && eleOne['start'] <= eleTwo['end']);

      eleOne['width'] = (this.totalWidth / (parallelObjArray.length || 1));
      eleOne['height'] = (eleOne['end'] - eleOne['start']) * 2;
      eleOne['top'] = eleOne['start'] * 2;
      if (eleOne['width'] === this.totalWidth) {
        eleOne['left'] = 0;
      } else {
        eleOne['left'] = positionX - eleOne['width'];
        positionX = positionX - eleOne['width'];
      }
    });
    return eventList;
  }

  setStyle(event: object): object {
    let styleObj: object = {};
    styleObj = { 'height': `${event['height']}px;`, 'bottom': `${event['top']}px;`, 'width': `${event['width']}px;` };
    return styleObj;
  }


}

