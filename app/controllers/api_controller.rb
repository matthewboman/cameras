class ApiController < ApplicationController
    protect_from_forgery with: :null_session

    # POST: Create an OSM camera
    def create_osm_camera
      # TODO: return if not authenticated

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

      # TODO: response
      # TODO: handle expired authentication
    end

    # GET: Returns all cameras from OpenStreetMaps
    def open_street_map_cameras
      cameras = Services::OpenStreetMaps.get_cameras(params[:bbox])
      render json: { cameras: cameras }
    end

  end
