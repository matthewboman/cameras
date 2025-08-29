class OsmOauthController < ApplicationController
  def start
    client_id    = ENV.fetch("OSM_CLIENT_ID")
    redirect_uri = ENV.fetch("OSM_REDIRECT_URL")
    scope_raw    = "read_prefs write_api"

    # OSM wants %20 between scopes (not '+')
    scope  = CGI.escape(scope_raw).gsub("+", "%20")
    query  = [
      "response_type=code",
      "client_id=#{CGI.escape(client_id)}",
      "redirect_uri=#{CGI.escape(redirect_uri)}",
      "scope=#{scope}",
      "state=#{SecureRandom.hex(12)}"
    ].join("&")

    authorize_url = "https://www.openstreetmap.org/oauth2/authorize?#{query}"

    redirect_to authorize_url, allow_other_host: true
  end


  def callback
    if params[:error].present?
      render plain: "OSM error: #{params[:error]}: #{params[:error_description]}", status: :bad_request and return
    end

    code          = params.require(:code)
    redirect_uri  = ENV.fetch("OSM_REDIRECT_URL")
    client_id     = ENV.fetch("OSM_CLIENT_ID")
    client_secret = ENV.fetch("OSM_CLIENT_SECRET")

    # OAuth2 token exchange (application/x-www-form-urlencoded)
    token_res = HTTParty.post(
      "https://www.openstreetmap.org/oauth2/token",
      headers: { "Content-Type" => "application/x-www-form-urlencoded" },
      body:    URI.encode_www_form(
        grant_type:    "authorization_code",
        code:          code,
        redirect_uri:  redirect_uri,
        client_id:     client_id,
        client_secret: client_secret
      )
    )

    unless token_res.success?
      render plain: "Token exchange failed: #{token_res.code} #{token_res.body}", status: :bad_gateway and return
    end

    token_json    = JSON.parse(token_res.body)
    access_token  = token_json["access_token"]
    refresh_token = token_json["refresh_token"]
    expires_in    = token_json["expires_in"]

    session[:osm_access_token]  = access_token
    session[:osm_refresh_token] = refresh_token
    session[:osm_expires_at]    = Time.now.to_i + expires_in.to_i if expires_in

    # Test call: get current user details (requires auth)
    user_res = HTTParty.get(
      "https://api.openstreetmap.org/api/0.6/user/details",
      headers: { "Authorization" => "Bearer #{access_token}" }
    )

    redirect_to root_path
  end
end
