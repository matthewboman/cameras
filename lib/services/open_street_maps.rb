module Services
  module OpenStreetMaps
    OSM_UA       = "Cameras/1.0 (+ccrsh@riseup.net)"
    OSM_URL      = "https://api.openstreetmap.org/api/0.6"
    OVERPASS_URL = "https://overpass-api.de/api/interpreter"

    # Public: Creates a CSV
    def self.create_csv(bbox)
      cameras = get_cameras(bbox)

      res = CSV.generate do |csv|
        csv << [
          'id',
          'lat',
          'lng',
          'company',
          'type',
          'surveillance type',
          'zone',
          'webcam'
        ]

        cameras.each do |camera|
          csv << [
            camera['id'],
            camera['lat'],
            camera['lon'],
            camera['tags']['manufacturer'],
            camera['tags']['camera:type'],
            camera['tags']['surveillance:type'],
            camera['tags']['surveillance:zone'],
            camera['tags']['contact:webcam']
          ]
        end
      end

      File.write(Rails.root.join("tmp", "avl.csv"), res)
    end

    # Public - Makes a POST request to get cameras
    #
    # bbox - String of comma-separated bounds "south,west,north,east"
    #
    # Returns an array of cameras
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
        OVERPASS_URL,
        body: { data: query }
      )

      res.parsed_response["elements"]
    end

    # TODO: tested XML creation
    #       not tested - changeset open/close, node create
    # Public - Makes a POST request to add a camera
    #
    # token          - OAuth token
    # camera_details - Hash { lat:, lon:, fields }
    def self.add_camera(token:, camera_details:)
      comment      = "Add surveillance camera"
      changeset_id = Private.osm_open_changeset(token: token)

      begin
        node_id = Private.osm_create_node(
          token:          token,
          changeset_id:   changeset_id,
          camera_details: camera_details
        )
      ensure
        begin
          osm_close_changeset(token: token, changeset_id: changeset_id)
        rescue
        end
      end

      node_id
    end

    module Private
      # Internal - Generates XML from a hash of fields
      #
      # fields - Hash describing camera. E.G. { surveillance: "public", "camera:type": "fixed", "camera:direction": 90, name: "City Hall Cam" }
      #
      # Returns XML
      def self.camera_tag_xml(fields)
        tags = {
          "man_made"          => "surveillance",
          "surveillance:type" => "camera",
          "camera:direction"  => fields["camera:direction"],
          "camera:mount"      => fields["camera:mount"],
          "camera:type"       => fields["camera:type"],
          "description"       => fields["description"],
          "manufacturer"      => fields["manufacturer"],
          "name"              => fields["name"],
          "surveillance"      => fields["surveillance"],
        }

        tags.filter{|_k, v| v && !v.to_s.strip.empty? }
            .map{|k, v|
              val = (k == "camera:direction") ? (v.to_i % 360).to_s : v.to_s
              %Q(<tag k="#{CGI.escapeHTML(k)}" v="#{CGI.escapeHTML(val)}"/>)
            }
            .join
      end

      # Internal - Creates headers for OSM POST requests
      #
      # token - OAuth token
      #
      # Returns a hash
      def self.headers(token)
        {
          "Authorization" => "Bearer #{token}",
          "User-Agent"    => OSM_UA,
          "Content-Type"  => "text/xml"
        }
      end

      # Internal: Wrapper to handle responses
      #
      # res    - Response from OpenStreetMaps
      # action - String. Function request performed in
      def ok_or_raise(res, action)
        return if res.code.to_i.between? 200, 299

        raise "#{action} failed: #{res.code} #{res.message} - #{res.body}"
      end

      # Internal - Closes a changeset
      #
      # token        - OAuth token
      # changeset_id - ID of opened changeset
      def osm_close_changeset(token:, changeset_id:)
        res = HTTParty.put(
          "#{OSM_URL}/changeset/#{changeset_id}/close",
          headers: headers(token)
        )

        ok_or_raise(res, "close changeset")
      end

      # Internal - Adds a camera to OSM
      #
      # token          - OAuth token
      # changeset_id   - ID of opened changeset
      # camera_details - Hash of lat, lon, tags
      #
      # Returns a node ID
      def self.osm_create_node(token:, changeset_id:, camera_details:)
        xml = <<~XML
          <osm>
            <node changeset="#{changeset_id}" lat="#{camera_details[:lat]}" lon="#{camera_details[:lon]}">
              #{camera_tag_xml(camera_details)}
            </node>
          </osm>
        XML

        res = HTTParty.put(
          "#{OSM_URL}/node/create",
          headers: headers(token),
          body:    xml
        )

        ok_or_raise(res, "create node")

        res.body.strip
      end

      # Internal - Open a changeset with the provided comment
      #
      # token   - OAuth token
      # comment - String
      #
      # Returns a changeset ID
      def self.osm_open_changeset(token:, comment:)
        xml = <<~XML
          <osm>
            <changeset>
              <tag k="created_by" v="#{CGI.escapeHTML(OSM_UA)}"/>
              <tag k="comment"    v="#{CGI.escapeHTML(comment)}"/>
            </changeset>
          </osm>
        XML

        res = HTTParty.put(
          "#{OSM_URL}/changeset/create",
          headers: headers(token),
          body:    xml
        )

        ok_or_raise(res, "open changeset")

        res.body.strip
      end
    end

  end
end