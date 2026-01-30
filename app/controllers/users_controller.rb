class UsersController < ApplicationController
  # GET: Render the user creation form
  def new
    @user = User.new
  end

  # POST: Create a new user
  def create
    @user = User.new(user_params)

    if @user.save
      flash[:notice] = "Account created. Please log in."
      redirect_to "/login"
    else
      flash.now[:alert] = @user.errors.full_messages.join(", ")
      render :new, status: :unprocessable_entity
    end
  end

  private

  # Internal: Specify user creation params
  def user_params
    params.require(:user)
          .permit(:email, :password)
  end
end
