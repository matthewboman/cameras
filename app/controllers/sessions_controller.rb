class SessionsController < ApplicationController
  # GET: Render the login page
  def new
  end

  # POST: Authenticate and log user in
  def create
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password]) && user.is_registered
      session[:user_id]           = user.id
      session[:is_admin]          = user.is_admin
      session[:is_data_collector] = user.is_data_collector
      session[:is_ice_verified]   = user.is_ice_verified

      redirect_to "/", notice: "Logged in successfully."
    else
      flash[:alert] = "Invalid email or password"
      render :new, status: :unauthorized
    end
  end

  # GET: Logs user out
  def destroy
    reset_session
    redirect_to "/", notice: "Logged out."
  end

end
