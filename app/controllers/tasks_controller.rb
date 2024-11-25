class TasksController < ApplicationController
  def show
    @task = Task.find(params[:id])
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.replace("task_detail", partial: "tasks/detail", locals: { task: @task })
        ]
      end
      format.html
    end
  end

  def create
    @task = Task.new(task_params)
    if @task.save
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.append("tasks_list", partial: "tasks/task", locals: { task: @task }),
            turbo_stream.replace("task_form", partial: "tasks/form", locals: { task: Task.new })
          ]
        end
      end
    else
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.replace("task_form", partial: "tasks/form", locals: { task: @task })
          ]
        end
      end
    end
  end

  def update
    @task = Task.find(params[:id])
    if @task.update(task_params)
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.replace("task_#{@task.id}", partial: "tasks/task", locals: { task: @task })
          ]
        end
      end
    else
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.replace("task_form", partial: "tasks/form", locals: { task: @task })
          ]
        end
      end
    end
  end

  def destroy
    @task = Task.find(params[:id])
    @task.destroy
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.remove("task_#{@task.id}")
      end
    end
  end

  private

  def task_params
    params.expect(task: [:name, :details, :due_date, :completed])[:task]
  end
end
