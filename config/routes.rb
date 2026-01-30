Rails.application.routes.draw do
  get "home", to: "home#index"
  get "ice",  to: "ice#index"
  get "up" => "rails/health#show", as: :rails_health_check

  # API
  get  "/api/ice-activity",               to: "api#ice_activity"
  get  "/api/open-street-map-cameras",    to: "api#open_street_map_cameras"
  post "/api/add-open-street-map-camera", to: "api#create_osm_camera"
  post "/api/report-ice",                 to: "api#create_ice_report"

  # OSM Authentication
  get  "/auth/osm/start",    to: "osm_oauth#start"
  get  "/auth/osm/callback", to: "osm_oauth#callback"

  # Authentication
  get  "/login",  to: "sessions#new"
  get  "/logout", to: "sessions#destroy"
  get  "/signup", to: "users#new"
  post "/login",  to: "sessions#create"
  post "/signup", to: "users#create"

  # User admin
  get   "/admin",                 to: "admin#index"
  patch "/admin/update-user/:id", to: "admin#update_user", as: :admin_update_user

  root "home#index"

  # SPA
  # get "*path", to: "home#index", constraints: ->(req) do
  #   !req.xhr? && req.format.html?
  # end
end
