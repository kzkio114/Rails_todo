import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["form"]

  connect() {
    console.log("Task form controller connected");
    this.calendarController = this.application.getControllerForElementAndIdentifier(
      document.querySelector("[data-controller='calendar']"),
      "calendar"
    );
  }

  submit(event) {
    event.preventDefault();
  
    // フォームデータをシンプルなオブジェクト形式に変換
    const formData = Object.fromEntries(new FormData(this.formTarget));
    const taskData = {
      name: formData["task[name]"],
      details: formData["task[details]"],
      due_date: formData["task[due_date]"],
      completed: formData["task[completed]"],
    };
  
    fetch(this.formTarget.action, {
      method: this.formTarget.method,
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify({ task: taskData }), // Railsが期待する形式
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("タスク作成中にエラーが発生しました");
        }
        return response.json();
      })
      .then((task) => {
        this.calendarController.addEvent(task); // カレンダーにイベントを追加
        this.formTarget.reset(); // フォームをリセット
      })
      .catch((error) => console.error(error));
  }
}
