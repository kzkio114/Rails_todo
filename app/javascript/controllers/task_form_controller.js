import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["form"];

  connect() {
    console.log("Task form controller connected");

    if (!this.hasRefreshedCalendar) {
      document.addEventListener("turbo:after-stream-render", () => {
        this.refreshCalendar();
      });
      this.hasRefreshedCalendar = true;
    }

    this.calendarController = this.application.getControllerForElementAndIdentifier(
      document.querySelector("[data-controller='calendar']"),
      "calendar"
    );

    if (!this.calendarController) {
      console.warn("Calendar controller not found. Skipping calendar updates.");
    }
  }

  submit(event) {
    event.preventDefault();
    this.sendTaskData('/api/v1/tasks', "POST");
  }

  async update(event) {
    event.preventDefault();
    const taskId = this.formTarget.dataset.taskId;
    const jsonUrl = `/api/v1/tasks/${taskId}`;
    const turboStreamUrl = `/tasks/${taskId}/task_detail_update`;

    console.log("開始: 更新処理", { taskId, jsonUrl, turboStreamUrl });

    try {
      // JSONリクエストを送信
      const data = await this.sendTaskData(jsonUrl, "PATCH");
      console.log("成功: JSONリクエスト", data);

      // Turbo Streamリクエストを送信
      await this.sendTurboStream(turboStreamUrl, "PATCH");
      console.log("成功: Turbo Streamリクエスト");
    } catch (error) {
      console.error("エラー: リクエスト処理中に問題発生", error);
    }
  }

  async sendTaskData(url, method) {
    const formData = Object.fromEntries(new FormData(this.formTarget));
    const taskData = {
      name: formData["task[name]"],
      details: formData["task[details]"],
      due_date: formData["task[due_date]"],
      completed: formData["task[completed]"],
    };

    console.log("送信するJSONデータ", { task: taskData });

    try {
      console.log("送信中: JSONリクエスト", url);
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({ task: taskData }),
      });

      if (!response.ok) {
        throw new Error(`HTTPエラー! ステータス: ${response.status}`);
      }

      const data = await response.json();
      console.log("受信: JSONレスポンス", data);

      if (method === "POST") {
        this.calendarController?.addEvent(data);
      } else if (method === "PATCH") {
        this.calendarController?.updateEvent(data);
      }

      this.formTarget.reset();
      return data;
    } catch (error) {
      console.error("エラー: JSONリクエスト処理中に問題発生", error);
      throw error;
    }
  }

  async sendTurboStream(url, method) {
    try {
      console.log("送信中: Turbo Streamリクエスト", url);
      const response = await fetch(url, {
        method: method,
        headers: {
          "Accept": "text/vnd.turbo-stream.html",
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTPエラー! ステータス: ${response.status}`);
      }

      const html = await response.text();
      console.log("受信: Turbo Streamレスポンス", html);
      Turbo.renderStreamMessage(html);
    } catch (error) {
      console.error("エラー: Turbo Streamリクエスト処理中に問題発生", error);
      throw error;
    }
  }

  refreshCalendar() {
    console.log("カレンダーのイベントを更新中");
    this.calendarController?.refreshEvents();
  }
}
