import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["form"];

  connect() {
    console.log("Task form controller connected");
    this.calendarController = this.application.getControllerForElementAndIdentifier(
      document.querySelector("[data-controller='calendar']"),
      "calendar"
    );
  }

  submit(event) {
    event.preventDefault();

    // フォームデータを取得して送信
    this.sendTaskData(this.formTarget.action, "POST");
  }

  update(event) {
    event.preventDefault();

    // 更新用URLを取得して送信
    const updateUrl = this.formTarget.action; // 編集フォームの場合
    this.sendTaskData(updateUrl, "PUT");
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
        if (!response.ok) {
          throw new Error("タスクの処理中にエラーが発生しました");
        }
        return response.json();
      })
      .then((task) => {
        if (method === "POST") {
          this.calendarController.addEvent(task); // 新規イベントを追加
        } else if (method === "PUT") {
          this.calendarController.updateEvent(task); // 更新処理を呼び出す
        }
        this.formTarget.reset(); // フォームをリセット
      })
      .catch((error) => console.error(error));
  }
}
