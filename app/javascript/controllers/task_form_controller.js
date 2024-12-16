import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="task-form"
export default class extends Controller {
  static targets = ["form", "calendarController"];

  connect() {
    this.calendarController = this.application.getControllerForElementAndIdentifier(
      document.querySelector("[data-controller='calendar']"),
      "calendar"
    );
  }

  submit(event) {
    event.preventDefault();

    fetch(this.formTarget.action, {
      method: this.formTarget.method,
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify(Object.fromEntries(new FormData(this.formTarget))),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("タスク作成中にエラーが発生しました");
        }
      })
      .then(() => {
        this.calendarController.refreshEvents(); // カレンダーを更新
      })
      .catch((error) => console.error(error));
  }
}