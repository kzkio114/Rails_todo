class ThemesController < ApplicationController
  def toggle
    session[:theme] = session[:theme] == "dark" ? "light" : "dark"
    render json: { theme: session[:theme] }
  end
end
