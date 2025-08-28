Rails.application.routes.draw do
  get "home/index"
  get "up" => "rails/health#show", as: :rails_health_check

  # API
  get  "/api/open-street-map-cameras", to: "api#open_street_map_cameras"

  # SPA
  root "home#index"
  get "*path", to: "home#index", constraints: ->(req) do
    !req.xhr? && req.format.html?
  end
end
