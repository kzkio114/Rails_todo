class CreateTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :tasks do |t|
      t.string :name
      t.text :details
      t.date :due_date
      t.boolean :completed

      t.timestamps
    end
  end
end
