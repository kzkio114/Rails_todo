class Task < ApplicationRecord
  broadcasts_to ->(task) { "tasks_list" }, inserts_by: :append
end
