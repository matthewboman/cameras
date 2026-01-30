class CreateUser < ActiveRecord::Migration[7.2]
  def change
    create_table :users do |t|
      t.string :email
      t.string :password_digest
      t.boolean :is_registered
      t.boolean :is_ice_verified
      t.boolean :is_data_collector
      t.boolean :is_admin
    end
  end
end
