class ApiController < ApplicationController
    # protect_from_forgery with: :null_session
    skip_before_action :verify_authenticity_token

    # POST: Create an OSM camera
    def create_osm_camera
      unless session[:osm_access_token]
        render json: { error: "Not authorized. No session found." }, status: :unauthorized and return
      end

      camera_details = params.require(:camera_details)
                            .permit(
                              "camera:type",
                              "camera:mount",
                              "name",
                              "description",
                              "manufacturer",
                              "lat",
                              "lon"
                             )
                            .to_h

      res = Services::OpenStreetMaps.add_camera(
        token:          session[:osm_access_token],
        camera_details: camera_details
      )

      render json: res, status: :ok
    end

    # GET: Returns all cameras from OpenStreetMaps
    def open_street_map_cameras
      cameras = Services::OpenStreetMaps.get_cameras(params[:bbox])
      render json: { cameras: cameras }
    end

  end
