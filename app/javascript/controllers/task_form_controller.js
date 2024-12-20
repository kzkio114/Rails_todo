import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["form"];

  connect() {
    console.log("Task form controller connected");

    // Turbo Stream後にカレンダーをリフレッシュする
    if (!this.hasRefreshedCalendar) {
      document.addEventListener("turbo:after-stream-render", () => {
        this.refreshCalendar();
      });
      this.hasRefreshedCalendar = true; // イベントリスナーの重複を防ぐ
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
    this.sendTaskData(this.formTarget.action, "PATCH");
  }

  sendTaskData(url, method) {
    const formData = Object.fromEntries(new FormData(this.formTarget));
    const taskData = {
      name: formData["task[name]"],
      details: formData["task[details]"],
      due_date: formData["task[due_date]"],
      completed: formData["task[completed]"],
    };

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify({ task: taskData }),
    })
      .then((response) => {
        const contentType = response.headers.get("Content-Type");

        if (contentType.includes("text/vnd.turbo-stream.html")) {
          // Turbo Streamレスポンスを処理
          response.text().then((html) => Turbo.renderStreamMessage(html));
        } else if (contentType.includes("application/json")) {
          // JSONレスポンスの場合
          return response.json();
        } else {
          throw new Error("不明なレスポンス形式です");
        }
      })
      .then((task) => {
        if (!task) return; // Turbo Streamが処理されている場合はスキップ

        // JSONレスポンスを処理してカレンダーを更新
        if (method === "POST") {
          this.calendarController.addEvent(task);
        } else if (method === "PATCH") {
          this.calendarController.updateEvent(task);
        }

        this.formTarget.reset();
      })
      .catch((error) => console.error("エラー:", error));
  }

  refreshCalendar() {
    if (this.calendarController) {
      this.calendarController.refreshEvents(); // カレンダーイベントの最新データを取得
    }
  }
}
