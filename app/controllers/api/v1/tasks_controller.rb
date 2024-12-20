class Api::V1::TasksController < ApplicationController
  # APIのみにするためCSRFを無効化
  skip_before_action :verify_authenticity_token

  def create
    @task = Task.new(task_params)
    if @task.save
        render json: {
            id: @task.id,
            title: @task.name,
            start: @task.due_date,
            allDay: true
        }, status: :created
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    task = Task.find(params[:id])
    if task.update(task_params)
        render json: {
            id: @task.id,
            title: @task.name,
            start: @task.due_date,
            allDay: true
        }, status: :ok
    else
      render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def task_params
    params.expect(task: [ :name, :details, :due_date, :completed ])
  end
end
