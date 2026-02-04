class SeparateDateAndTime < ActiveRecord::Migration[8.0]
  def change
    add_column :ice_datasets, :spotted_on, :date
    add_column :ice_datasets, :spotted_time, :time

    execute <<~SQL
      UPDATE ice_datasets
      SET
        spotted_on = spotted_at::date,
        spotted_time = spotted_at::time
      WHERE spotted_at IS NOT NULL
    SQL

    # optional, if you no longer want it
    remove_column :ice_datasets, :spotted_at
  end
end
