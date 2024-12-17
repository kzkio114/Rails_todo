class EventsController < ApplicationController
  def index
    tasks = Task.all.map do |task|
      {
        id: task.id,
        title: task.name,
        start: task.due_date,
        allDay: true
      }
    end

    render json: tasks
  end
end
