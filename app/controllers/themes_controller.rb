class ThemesController < ApplicationController
  def toggle
    current_theme = session[:theme] || "light" #初期からlightを設定
    next_theme = ThemeManager.next_theme(current_theme) #次のテーマを取得
    session[:theme] = next_theme #セッションに保存
    render json: { theme: next_theme } #JSONで返す theme_toogle.js.erbに渡す
  end
end
