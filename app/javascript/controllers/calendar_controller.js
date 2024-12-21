import { Controller } from "@hotwired/stimulus"
import { Calendar } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja'; // 日本語ロケールを追加

// Connects to data-controller="calendar"
export default class extends Controller {
  static targets = ["calendar"];

  connect() {
    console.log("カレンダーコントローラーが接続されました。");
    this.calendar = new Calendar(this.calendarTarget, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      selectable: true,
      events: "/api/v1/events", // 統一されたAPIエンドポイント
      locale: jaLocale, // 日本語ロケールの設定
    });
    this.calendar.render();
  }

  addEvent(eventData) {
    if (!eventData.id) {
      console.error("追加するイベントデータにIDがありません:", eventData);
      return;
    }
    this.calendar.addEvent(eventData); // 新しいイベントをカレンダーに追加
  }

  updateEvent(eventData) {
    if (!eventData.id) {
      console.error("更新するイベントデータにIDがありません:", eventData);
      return;
    }
    const existingEvent = this.calendar.getEventById(eventData.id);
    if (existingEvent) {
      existingEvent.setProp("title", eventData.title);
      existingEvent.setStart(eventData.start);
      existingEvent.setEnd(eventData.end || null);
    } else {
      console.warn("イベントが見つからなかったため、新規追加します:", eventData);
      this.addEvent(eventData); // イベントが存在しない場合は追加
    }
  }

  refreshEvents() {
    fetch("/api/v1/events") // JSONデータを取得
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTPエラー: ${response.status}`);
        }
        return response.json();
      })
      .then(events => {
        this.calendar.removeAllEvents(); // 既存のイベントを削除
        this.calendar.addEventSource(events); // 新しいイベントデータを追加
      })
      .catch(error => console.error("カレンダーの更新中にエラーが発生しました:", error));
  }

  disconnect() {
    console.log("カレンダーコントローラーが切断されました。");
    this.calendar.destroy(); // カレンダーを破棄
  }
}
