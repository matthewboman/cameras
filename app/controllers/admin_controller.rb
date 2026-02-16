class AdminController < ApplicationController
  before_action :require_login

  # GET: Landing page
  def index
  end

  # GET: Translation page
  def translate
    @datasets = IceDataset.needs_translation
  end

  # GET: User management page
  def user_management
    @users = User.all
  end

  # PATCH: Add a translation
  def update_translation
    dataset = IceDataset.find(params[:id])
    attrs   = params.require(:ice_dataset)
                    .permit(:title, :body, :es_title, :es_body)
                    .to_h
                    .transform_values { |v| v.is_a?(String) && v.strip == "" ? nil : v }

    dataset.update!(attrs)

    redirect_to admin_translate_path, notice: "Saved"
  end

  # PATCH: Update user permissions
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
