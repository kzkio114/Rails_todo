class TasksController < ApplicationController
  def index
    @tasks = Task.all
    @task = Task.new
  end

  def show
    @task = Task.find(params[:id])
  end

  def create
    @task = Task.new(task_params)
    @task.save
  end

  def update
    @task = Task.find(params[:id])
    @task.update(task_params)
  end

  def destroy
    @task = Task.find(params[:id])
    @task.destroy
  end

  private

  def task_params
    params.expect(task: [:name, :details, :due_date, :completed])[:task]
  end
end
