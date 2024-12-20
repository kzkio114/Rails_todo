class Task < ApplicationRecord
  broadcasts_to ->(task) { "tasks_list" }, inserts_by: :append, target: "tasks_list"
  
  after_destroy_commit -> {
    broadcast_replace_to(
      "task_detail",
      target: "task_detail",
      partial: "tasks/detail_deleted",
      locals: { task: self }
    )
  }

  after_update_commit -> {
    broadcast_morph_to(
      "task_preview",
      target: "task_preview",
      partial: "tasks/preview",
      locals: { task: self }
    )
  }
end
