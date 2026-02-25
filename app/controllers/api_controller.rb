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
                        :category,
                        :date,
                        :description,
                        :time,
                        :title,
                        :address,
                        :language,
                        location: [:lat, :lng]
                      )

      # Get the address
      if details[:address].blank?
        details[:address] = Services::OpenStreetMaps.get_address_from_geo location: details[:location]
      end

      # Handle language
      language = details[:language].to_s
      title    = language == "ENG" ? details[:title]       : nil
      body     = language == "ENG" ? details[:description] : nil
      es_title = language == "ES"  ? details[:title]       : nil
      es_body  = language == "ES"  ? details[:description] : nil

      res = IceDataset.create(
        title:        title,
        es_title:     es_title,
        body:         body,
        es_body:      es_body,
        spotted_on:   details[:date],
        spotted_time: details[:time],
        category:     details[:category],
        address:      details[:address],
        location:     "POINT(#{details[:location]['lng']} #{details[:location]['lat']})"
      )

      if res.errors.blank?
        render json: res, status: 200
      else
        render json: { error: "Error creating report" }, status: 500
      end
    end

    # GET: Returns ICE activity
    def ice_activity
      min_lat, min_lng, max_lat, max_lng = params[:bbox].split(",").map(&:to_f)

      ice = IceDataset.by_coordinates(min_lat, min_lng, max_lat, max_lng)
                      .by_categories(params[:categories])
                      .by_date(params[:start_date], params[:end_date])
                      .map{|i| Services::Format.ice_for_map(i)}

      render json: { ice: ice }
    end

    # GET: Returns all cameras from OpenStreetMaps
    def open_street_map_cameras
      cameras = Services::OpenStreetMaps.get_cameras(params[:bbox])
      render json: { cameras: cameras }
    end

  end
