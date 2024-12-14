class ThemesController < ApplicationController
  def toggle
    session[:theme] = session[:theme] == "dark" ? "light" : "dark"
    redirect_to root_path
  end
end
