class ApplicationController < ActionController::Base
  allow_browser versions: :modern
  before_action :set_current_user

  private

  def set_current_user
    @user_id           = session[:user_id]
    @is_admin          = session[:is_admin]
    @is_data_collector = session[:is_data_collector]
    @is_ice_verified   = session[:is_ice_verified]
  end
end
