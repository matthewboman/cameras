class ApiController < ApplicationController
    protect_from_forgery with: :null_session

    # GET: Returns all Flock cameras from OpenStreetMaps
    def open_street_map_cameras
      cameras = Services::OpenStreetMaps.get_cameras(params[:bbox])
      render json: { cameras: cameras }
    end

  end
