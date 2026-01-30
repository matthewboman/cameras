class CreateIceDataset < ActiveRecord::Migration[8.0]
  def change
    create_table :ice_datasets do |t|
      t.string   :title
      t.string   :body
      t.string   :category
      t.string   :address
      t.datetime :spoted_at
      t.boolean  :verfied

      t.st_point :location, geographic: true, srid: 4326

      t.timestamps
    end

    add_index :ice_datasets, :location, using: :gist
  end
end
