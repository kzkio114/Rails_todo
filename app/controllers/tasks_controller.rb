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
      respond_to do |format|
      
      format.json do
      render json: {
      id: @task.id,
      title: @task.name,
      start: @task.due_date,
      allDay: true
    }, status: :ok
    format.turbo_stream # Turbo Stream用のHTMLを返す
  end
end
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @task = Task.find(params[:id])
    @task.destroy

    render json: { id: @task.id, message: "タスクが削除されました" }, status: :ok
  end

  private

  def task_params
    params.expect(task: [ :name, :details, :due_date, :completed ])
  end
end
