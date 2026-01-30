# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_01_30_164621) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "postgis"

  create_table "ice_datasets", force: :cascade do |t|
    t.string "title"
    t.string "body"
    t.string "category"
    t.string "address"
    t.datetime "spotted_at"
    t.boolean "verfied", default: false, null: false
    t.geography "location", limit: {srid: 4326, type: "st_point", geographic: true}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "report_type"
    t.index ["location"], name: "index_ice_datasets_on_location", using: :gist
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.boolean "is_registered"
    t.boolean "is_ice_verified"
    t.boolean "is_data_collector"
    t.boolean "is_admin"
  end
end
