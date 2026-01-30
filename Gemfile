source "https://rubygems.org"

gem "activerecord-postgis-adapter", "~> 11.0"
gem "bcrypt", "~> 3.1.7"
gem 'csv', '~> 3.3.0'
gem "dotenv-rails"
gem 'httparty'
gem "importmap-rails"
gem "jbuilder"
gem "pg", "~> 1.1"
gem "propshaft"
gem "puma", ">= 5.0"
gem "rack-cors"
gem "rails", "~> 8.0.3"
gem "stimulus-rails"
gem "tailwindcss-ruby", "~> 4.0"
gem "tailwindcss-rails", "~> 4.4"
gem "turbo-rails"
gem "vite_rails", "~> 3.0"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ jruby ]

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[ mri ], require: "debug/prelude"

  # Static analysis for security vulnerabilities [https://brakemanscanner.org/]
  gem "brakeman", require: false

  # Omakase Ruby styling [https://github.com/rails/rubocop-rails-omakase/]
  gem "rubocop-rails-omakase", require: false
end

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem "web-console"
end

group :test do
  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem "capybara"
  gem "selenium-webdriver"
end
