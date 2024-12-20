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

  class TasksController < ApplicationController
    def update
      @task = Task.find(params[:id])
      if @task.update(task_params)
        # JSONリクエストが来た場合に対応
        if request.format.json?
          render json: @task, status: :ok
        else
          # Turbo Streamリクエストに対応
          render turbo_stream
        end
      else
        # エラーレスポンス
        if request.format.json?
          render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
        else
          render turbo_stream: turbo_stream.replace("task_detail", partial: "tasks/detail", locals: { task: @task })
        end
      end
    end
  
    private
  
    def task_params
      params.require(:task).permit(:name, :details, :due_date, :completed)
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
