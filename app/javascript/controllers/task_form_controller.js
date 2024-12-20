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

  update(event) {
    event.preventDefault();
    const taskId = this.formTarget.dataset.taskId;
    const jsonUrl = `/api/v1/tasks/${taskId}`;
    const turboStreamUrl = `/tasks/${taskId}`;

    this.sendTaskData(jsonUrl, "PATCH")
      .then(() => {
        // JSONリクエストが成功したらTurbo Streamリクエストを送信
        return this.sendTurboStream(turboStreamUrl, "PATCH");
      })
      .catch((error) => console.error("JSONリクエストエラー:", error));
  }

  async sendTaskData(url, method) {
    const formData = Object.fromEntries(new FormData(this.formTarget));
    const taskData = {
      name: formData["task[name]"],
      details: formData["task[details]"],
      due_date: formData["task[due_date]"],
      completed: formData["task[completed]"],
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({ task: taskData }),
      });

      const contentType = response.headers.get("Content-Type");
      if (contentType.includes("application/json")) {
        const data = await response.json();
        if (method === "POST") {
          this.calendarController.addEvent(data);
        } else if (method === "PATCH") {
          this.calendarController.updateEvent(data);
        }
        this.formTarget.reset();
        return data; // 成功したデータを返す
      } else {
        throw new Error("不明なレスポンス形式です");
      }
    } catch (error) {
      console.error("JSONリクエストエラー:", error);
      throw error;
    }
  }

  async sendTurboStream(url, method) {
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Accept": "text/vnd.turbo-stream.html",
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
        },
      });

      if (response.ok) {
        const html = await response.text();
        Turbo.renderStreamMessage(html);
      } else {
        console.error("Turbo Streamリクエストが失敗しました");
      }
    } catch (error) {
      console.error("Turbo Streamエラー:", error);
    }
  }

  refreshCalendar() {
    if (this.calendarController) {
      this.calendarController.refreshEvents();
    }
  }
}
