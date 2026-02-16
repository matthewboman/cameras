class AddSpanishToDatasets < ActiveRecord::Migration[8.0]
  def change
    add_column :ice_datasets, :es_title, :text
    add_column :ice_datasets, :es_body,  :text
  end
end
