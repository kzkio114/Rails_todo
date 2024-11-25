class TopsController < ApplicationController
  def index
    @tasks = Task.all
  end
end
