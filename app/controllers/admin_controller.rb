class AdminController < ApplicationController
  before_action :require_login

  # GET: Landing page
  def index
    @users = User.all
  end

  # PUT: Update user permissions
  def update_user
    user = User.find(params[:id])

    user.update(user_params)

    redirect_to "/admin", notice: "Updated."
  end

  private

  # Internal: Redirect non-admin
  def require_login
    redirect_to "/login", alert: "Please log in" unless session[:user_id]
  end

  # Internal: Permit specific params
  def user_params
    params.require(:user).permit(
      :is_registered,
      :is_ice_verified,
      :is_data_collector,
      :is_admin
    )
  end
end
