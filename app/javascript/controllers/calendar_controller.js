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
    });
    this.calendar.render();
  }

  addEvent(eventData) {
    this.calendar.addEvent(eventData); // 新しいイベントをカレンダーに追加
  }

  refreshEvents() {
    fetch("/events.json") // JSONデータを取得
      .then(response => response.json())
      .then(events => {
        this.calendar.removeAllEvents(); // 既存のイベントを削除
        this.calendar.addEventSource(events); // 新しいイベントデータを追加
      })
      .catch(error => console.error("カレンダーの更新中にエラーが発生しました:", error));
  }

  disconnect() {
    this.calendar.destroy(); // カレンダーを破棄
  }
}
