module Services
  module OpenStreetMaps
    BASE_URL = "https://overpass-api.de/api/interpreter"

    # Public - Makes a POST request to get cameras
    #
    # bbox - String of comma-separated bounds "south,west,north,east"
    def self.get_cameras(bbox)
      return [] if bbox.blank?

      query = <<~QL
        [out:json];
        node
          ["man_made"="surveillance"]
          (#{bbox});
        out;
      QL

      res = HTTParty.post(
        BASE_URL,
        body: { data: query }
      )

      res.parsed_response["elements"]
    end

    def self.add_camera()

    end

  end
end