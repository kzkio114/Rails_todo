import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="theme-toggle"
export default class extends Controller {
  static targets = ["button"];

  connect() {
    // テーマ切り替えボタンをクリックしたときの処理を設定
    this.updateTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }

  toggleTheme() {
    // サーバーにテーマ切り替えリクエストを送信
    fetch("/toggle_theme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.updateTheme(data.theme);
      });
  }

  updateTheme(theme) {
    // HTMLタグのクラスを更新
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
}
