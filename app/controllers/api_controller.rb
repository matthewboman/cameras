class ApiController < ApplicationController
    # protect_from_forgery with: :null_session
    skip_before_action :verify_authenticity_token

    # POST: Create an OSM camera
    def create_osm_camera
      unless session[:osm_access_token]
        render json: { error: "Not authorized. No session found." }, status: :unauthorized and return
      end

      details = params.require(:camera_details)
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
        camera_details: details
      )

      render json: res, status: :ok
    end

    # POST: Create an ICE record
    def create_ice_report
      unless session[:user_id] && session[:is_ice_verified]
        render json: { error: "Not authorized. No session found." }, status: :unauthorized and return
      end

      details = params.require(:report)
                      .permit(
                        'category',
                        'date',
                        'description',
                        'time'
                      )
                      .to_h
      # TODO: build this
      # TODO: change `spotted_at`: separate date AND time
      debugger
    end

    # GET: Returns ICE activity
    def ice_activity
      min_lat, min_lng, max_lat, max_lng = params[:bbox].split(",").map(&:to_f)

      ice = IceDataset.where(
        "location && ST_MakeEnvelope(?, ?, ?, ?, 4326)::geography",
        min_lng, min_lat, max_lng, max_lat
      ).map{|i| {
        id:          i.id,
        lat:         i.lat,
        lon:         i.lon,
        title:       i.title,
        body:        i.body,
        category:    i.category,
        verfied:     i.verfied,
        spotted_at:  i.spotted_at,
        report_type: i.report_type
      }}

      render json: { ice: ice }
    end

    # GET: Returns all cameras from OpenStreetMaps
    def open_street_map_cameras
      cameras = Services::OpenStreetMaps.get_cameras(params[:bbox])
      render json: { cameras: cameras }
    end

  end
