class FixIceDatasets < ActiveRecord::Migration[8.0]
  def change
    rename_column :ice_datasets, :spoted_at, :spotted_at

    execute <<~SQL
      UPDATE ice_datasets
      SET verfied = false
      WHERE verfied IS NULL;
    SQL

    change_column_default :ice_datasets, :verfied, false
    change_column_null    :ice_datasets, :verfied, false

    add_column :ice_datasets, :report_type, :text
  end
end
