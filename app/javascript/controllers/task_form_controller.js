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
    const turboStreamUrl = `/tasks/${taskId}/task_detail_update`;
    const jsonUrl = `/api/v1/tasks/${taskId}`;

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

  async delete(event) {
    event.preventDefault();
    const taskId = event.target.closest("button").dataset.taskId; // 削除するタスクのIDを取得
    const deleteUrl = `/api/v1/tasks/${taskId}`;
  
    console.log("開始: 削除処理", { taskId, deleteUrl });
  
    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTPエラー! ステータス: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("削除成功:", data);
  
      // カレンダーからイベントを削除
      this.removeEventFromCalendar(taskId);
  
      // HTMLからタスクを削除
      const taskElement = document.getElementById(`task_${taskId}`);
      if (taskElement) {
        taskElement.remove();
      }
    } catch (error) {
      console.error("削除中にエラーが発生:", error);
    }
  }
  
  removeEventFromCalendar(taskId) {
    const event = this.calendarController?.calendar.getEventById(taskId);
    if (event) {
      event.remove();
      console.log(`カレンダーからイベント削除: ${taskId}`);
    } else {
      console.warn(`イベントが見つかりません: ${taskId}`);
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
