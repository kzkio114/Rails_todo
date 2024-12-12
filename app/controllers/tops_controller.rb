class TopsController < ApplicationController

  def index ;end

  def toggle_theme
    session[:dark_mode] = !session[:dark_mode] # 状態を切り替え

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(
          "theme-container",
          partial: "layouts/theme",
          locals: { dark_mode: session[:dark_mode] }
        )
      end
    end
  end
end