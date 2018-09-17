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
    this.drawEventList(this.eventList);
  }

  /** 
   * Calculate position of the events in the calendar.
   */
  drawEventList(eventList: Array<Event>): Array<Event> {


    let FinalEventListObject: object = this.calcEventsPosition();
    let finalEventArray: Array<Event> = [];

    Object.keys(FinalEventListObject).forEach(key => {
      let event: any = this.eventList.find(ele => {
        return ele.id == key;
      }) || {};
      event['width'] = FinalEventListObject[key]['width'];
      event['left'] = FinalEventListObject[key]['left'];
      finalEventArray.push(event);
    });

    finalEventArray.forEach((ele: Event) => {
      ele['top'] = ele['start'] * 2;
      ele['height'] = (ele['end'] - ele['start']) * 2;
      ele['color'] = this.getRandomColor();
    });
    return finalEventArray;
  }

  setStyle(event: object): object {
    let styleObj: object = {};
    styleObj = { 'height': `${event['height']}px;`, 'bottom': `${event['top']}px;`, 'width': `${event['width']}px;` };
    return styleObj;
  }

  /** 
   * Event form.
   */
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
        this.drawEventList(this.eventList);
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

  /** 
   * Get event list with positions.
   * {id: 'event 1', width: xxx, left: xxx}
   */
  calcEventsPosition(): object {

    let sortedheightList: Array<object> = this.sortByHeight(this.eventList, false),
      eventGroupList: object = {}, eventsWithLength = {};

    sortedheightList.forEach(singleObj => {
      let obj: Event = this.eventList.find(ele => {
        return ele.id == singleObj['id'];
      });
      if (!this.checkIngroup(eventGroupList, singleObj)) {
        eventGroupList[singleObj['id']] = this.groupEvent(obj);
      }
    });
    eventsWithLength = this.getDivideCount(eventGroupList);
    return this.getEventPositionList(eventGroupList, eventsWithLength);

  }

  /** 
   * Get event list with positions.
   * {width: xxx, left: xxx}
   */
  getEventPositionList(groupsMap: object, divisorList: object): object {

    var eventsWithPosition = {};
    Object.keys(groupsMap).forEach(key => {

      let calendarFullWidth: number = this.totalWidth, widthCount = 0;
      let eventListByDuration: Array<object> = this.sortByHeight(groupsMap[key], true);

      for (let i: number = 0; i < eventListByDuration.length; i++) {

        let single: object = eventListByDuration[i], floatLeft: number = widthCount;
        if (divisorList[single['id']] != groupsMap[key].length) {

          let eventBoxWidth: number = calendarFullWidth / divisorList[single['id']];
          eventsWithPosition[single['id']] = { width: eventBoxWidth, left: floatLeft };
          widthCount += eventBoxWidth;
        } else {

          var eventBoxWidth: number = (calendarFullWidth - widthCount) / (eventListByDuration.length - i);
          eventsWithPosition[single['id']] = { width: eventBoxWidth, left: floatLeft };
          widthCount += eventBoxWidth;
        }
      }
    });
    return eventsWithPosition;
  }

  /** 
   * Returns events with divisor count
   */
  getDivideCount(groupsMap: object): object {

    let list: object = {};
    this.eventList.forEach(event => {
      let maxCount: number = 0;
      Object.keys(groupsMap).forEach(key => {
        groupsMap[key].forEach(lineObject => {
          if (lineObject.id == event.id && maxCount <= groupsMap[key].length) {
            maxCount = groupsMap[key].length;
          }
        });
      });
      list[event.id] = maxCount;
    });
    return list;
  }


  checkIngroup(groupsMap: object, element: object): boolean {

    let result: boolean = false;
    Object.keys(groupsMap).forEach(key => {
      (groupsMap[key] || []).forEach(ele => {
        if (ele.id == element['id']) {
          result = true;
        }
      });
    });
    return result;
  }


  /** 
   * Filter one events
   */
  groupEvent(obj: object): Array<Event> {

    return this.eventList.filter(ele => ((obj['end'] > ele['start']) && (obj['start'] < ele['end'])));
  }

  /** 
   * Sort events by height
   * Returns an object with heights
   */
  sortByHeight(eventList: any, sortOrder: boolean): Array<object> {

    let mappedList: Array<object> = eventList.map(val => {
      let obj: Object = { id: val.id, height: val.end - val.start };
      return obj;
    }).sort((val1: object, val2: object) => {
      if (sortOrder) {
        return val1['height'] < val2['height'];
      } else {
        return val1['height'] > val2['height'];
      }
    });
    return mappedList;
  }

  /** 
   * Random color
   */
  getRandomColor(): string {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }



}

