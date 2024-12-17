class TasksController < ApplicationController
  def index
    @tasks = Task.all
    # @task = Task.new
  end

  def show
    @task = Task.find(params[:id])
  end

  # def new
  #   @task = Task.new
  # end

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

  # def edit
  #   @task = Task.find(params[:id])
  # end

  def update
    @task = Task.find(params[:id])
    if @task.update(task_params)
    end
  end

  def destroy
    @task = Task.find(params[:id])
    @task.destroy
  end

  private

  def task_params
    params.expect(task: [ :name, :details, :due_date, :completed ])
  end
end
