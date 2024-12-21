import { Controller } from "@hotwired/stimulus";

// ここでテーマ切り替えのコントローラーを作成
// Connects to data-controller="theme-toggle"
export default class extends Controller {
  static targets = ["button", "themeName"];

  connect() {
    // ページ読み込み時に現在のテーマを表示
    this.updateThemeDisplay(document.documentElement.getAttribute("data-theme") || "light");
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
        // サーバーから返されたテーマを反映
        this.updateTheme(data.theme);
        this.updateThemeDisplay(data.theme);
      });
  }

  updateTheme(theme) {
    // HTMLタグのクラスを更新
    document.documentElement.setAttribute("data-theme", theme);
  }

  updateThemeDisplay(theme) {
    // ボタンのテキストを更新
    this.themeNameTarget.textContent = theme;
  }
}
