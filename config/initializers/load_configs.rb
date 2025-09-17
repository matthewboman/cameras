# Protected: Load the specified file into a hash with indifferent access
#
# file_name - name of the config file to load
#
# Returns - a hash with indifferent access
load_yaml = -> (file_name) do
  file = File.read("#{Rails.root}/config/#{file_name}")
  hash = YAML.safe_load(file, aliases: true)[Rails.env]
  HashWithIndifferentAccess.new hash
end

APP_CONFIG = load_yaml.('app_settings.yml') unless defined?(APP_CONFIG)