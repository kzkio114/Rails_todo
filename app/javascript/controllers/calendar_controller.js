import { Controller } from "@hotwired/stimulus"
import { Calendar } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


// Connects to data-controller="calendar"
export default class extends Controller {
  static targets = ["calendar"];

  connect() {
    this.calendar = new Calendar(this.calendarTarget, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      selectable: true,
      events: "/events.json", // サーバーからイベントを取得するエンドポイント
      dateClick: this.handleDateClick.bind(this),
    });
    this.calendar.render();
  }

  handleDateClick(info) {
    alert(`選択した日付: ${info.dateStr}`);
  }

  refreshEvents() {
    fetch("/events.json")
      .then(response => response.json())
      .then(events => {
        this.calendar.removeAllEvents(); // 既存のイベントを削除
        this.calendar.addEventSource(events); // 新しいイベントを追加
      });
  }

  disconnect() {
    this.calendar.destroy();
  }
}