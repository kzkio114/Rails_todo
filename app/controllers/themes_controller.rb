class ThemesController < ApplicationController
  def toggle
    current_theme = session[:theme] || "light"
    next_theme = ThemeManager.next_theme(current_theme)
    session[:theme] = next_theme
    render json: { theme: next_theme }
  end
end
