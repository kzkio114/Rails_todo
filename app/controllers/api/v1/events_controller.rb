class Api::V1::EventsController < ApplicationController
  # API専用にする場合はCSRFチェックをスキップ
  skip_before_action :verify_authenticity_token

  def index
    tasks = Task.all.map do |task|
      {
        id: task.id,
        title: task.name,
        start: task.due_date,
        allDay: true
      }
    end

    render json: tasks, status: :ok
  end
end
