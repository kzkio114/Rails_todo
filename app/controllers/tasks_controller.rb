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

  def task_detail_update
    @task = Task.find(params[:id])
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
