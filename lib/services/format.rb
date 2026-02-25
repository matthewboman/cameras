module Services
  class Format

    # Public: Formats Ice data for the frontend
    #
    # record - IceDataset
    #
    # Returns JSON
    def self.ice_for_map(record)
      {
        id:           record.id,
        lat:          record.lat,
        lon:          record.lon,
        title:        record.title,
        es_title:     record.es_title,
        body:         record.body,
        es_body:      record.es_body,
        category:     record.category,
        address:      record.address,
        verfied:      record.verfied,
        spotted_on:   record.spotted_on,
        spotted_time: record.spotted_time,
        report_type:  record.category
      }
    end

  end
end