<template>
  <div id="app" class="container">
  <div class="row">
    <div class="col text-right">
      <button class="btn btn-primary" v-on:click="logout">Logout</button>
    </div>
  </div>
  <div class="row">
    <div class="col-sm">
      <div v-if="success_msg" class="alert alert-success alert-dismissible">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        <p class="mb-0">{{success_msg}}</p>
      </div>
      <div v-if="error_msg" class="alert alert-warning alert-dismissible">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        <p class="mb-0">{{error_msg}}</p>
      </div>
    </div>
  </div>
    <div class="row">
      <div class="col-sm">
        <div class="card">
          <div class="card-body text-center">
            <h4>Create Event</h4>
            <datetime
              type="datetime"
              v-model="createEvent"
              placeholder="Select event date"
              value-zone="UTC"
              zone="UTC"
              :min-datetime="minDatetime"
              :minute-step="30"
              :week-start="7"
              auto
            ></datetime>
            <br />
            <button class="btn btn-primary" v-on:click="createEventFunc">Create</button>
          </div>
        </div>
      </div>
      <div class="col-sm">
        <div class="card">
          <div class="card-body text-center" >
            <h4>Free Slots</h4>
            <datetime
              type="date"
              v-model="freeSlots"
              placeholder="Select date"
              auto
            ></datetime>
            <br />
            <button class="btn btn-primary" v-on:click="fetchEvents">Fetch</button>
            <br />
            <h5 v-if="freeSlotList.length > 0">Free Slots</h5>
            <ul class="text-left" v-if="freeSlotList.length > 0">
              <li v-for="item in freeSlotList" v-bind:key="item">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-sm">
        <div class="card">
          <div class="card-body text-center">
            <h4>Get Event</h4>
            <datetime
              type="date"
              v-model="getEventStart"
              placeholder="Select start date"
              auto
            ></datetime>
            <br />
            <datetime
              type="date"
              v-model="getEventEnd"
              placeholder="Select end date"
              auto
            ></datetime>
            <br />
            <button class="btn btn-primary" v-on:click="getEvents">Fetch</button>
            <br />
            <h5 v-if="eventList.length > 0">Events</h5>
            <ul class="text-left">
              <li v-for="event in eventList" v-bind:key="event">
              {{ event.date }}
                <ul class="text-left">
                  <li v-for="item in event.time" v-bind:key="item">
                    {{ item }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { Datetime } from 'vue-datetime';
import CONSTANTS from '../constant';
import 'vue-datetime/dist/vue-datetime.min.css';

/* eslint-disable */

export default {
  components: {
    datetime: Datetime,
  },
  data: () => ({
    success_msg: '',
    error_msg: '',
    createEvent: '',
    minDatetime: '',
    freeSlots: '',
    freeSlotList: [],
    getEventStart: '',
    getEventEnd: '',
    eventList: [],
  }),
  mounted() {
    if (localStorage.token) {
      let today = new Date();
      let date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
      this.minDatetime = date.concat('T00:00:00Z');
    } else {
      window.location.href = 'account';
    }
  },
  methods: {
    logout() {
      localStorage.clear();
      window.location.href = '/';
    },
    createEventFunc() {
      if (this.createEvent != '') {
        let date = this.createEvent.split('T')[0];
        let time = (this.createEvent.split('T')[1]).split('.')[0];
        fetch(CONSTANTS.API_URL.concat('events'), {
          method: 'POST',
          body: JSON.stringify({date:date, time: time, duration: CONSTANTS.DURATION}),
          headers: {
            'content-type': 'application/json',
            'Authorization': localStorage.token,
          },
        }).then(response => response.json())
          .then((result) => {
            if (result.status === 'error') {
              this.error_msg = result.msg;
            } else {
              this.success_msg = result.msg;
            }
          });
      }
    },
    getFormattedDate(dateObj) {
      return dateObj.getFullYear() + "-" + ( dateObj.getMonth() + 1 ) + "-" + (dateObj.getDate() < 10?'0'+dateObj.getDate():dateObj.getDate());
    },
    fetchEvents() {
      if (this.freeSlots != '') {
        let date = this.freeSlots.split('T')[0];
        fetch(CONSTANTS.API_URL.concat('freeSlots?date=').concat(date), {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'Authorization': localStorage.token,
          },
        }).then(response => response.json())
          .then((result) => {
            if (result.status === 'error') {
              this.error_msg = result.msg;
            } else {
              this.freeSlotList = result.msg;
            }
          });
      }
    },
    getEvents() {
      if (this.getEventStart != '' && this.getEventEnd != '') {
        let startDate = new Date(this.getEventStart);
        let endDate = new Date(this.getEventEnd);
        if (endDate.getTime() < startDate.getTime()) {
          let dummy = this.getEventStart;
          this.getEventStart = this.getEventEnd;
          this.getEventEnd = dummy;
        }
        startDate = this.getEventStart.split('T')[0];
        endDate = this.getEventEnd.split('T')[0];
        let url = CONSTANTS.API_URL.concat('events?');
        url = url.concat('start_date=' + startDate);
        url = url.concat('&end_date=' + endDate);
        fetch(url, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'Authorization': localStorage.token,
          },
        }).then(response => response.json())
          .then((result) => {
            if (result.status === 'error') {
              this.error_msg = result.msg;
            } else {
              let tmpList = [];
              startDate = new Date(this.getEventStart);
              endDate = new Date(this.getEventEnd);
              let oneDay = (24 * 60 * 60 * 1000);
              for (var d = startDate.getTime(); d <= endDate.getTime(); d = d + oneDay) {
                let dateStr = this.getFormattedDate(new Date(d));
                if (dateStr in result.msg) {
                  let timeList = [];
                  for (var item in result.msg[dateStr]) {
                    timeList.push(item);
                  }
                  timeList = timeList.sort();
                  tmpList.push({'date': dateStr, 'time': timeList});
                }
              }
              this.eventList = tmpList;
            }
          });
      }
    }
  },
};
</script>
