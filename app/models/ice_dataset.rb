class IceDataset < ApplicationRecord

  scope :needs_translation, -> {
    self.where("title IS NULL OR body IS NULL OR es_title IS NULL OR es_body IS NULL")
  }

  # Returns the latitude of a point
  def lat
    location&.latitude
  end

  # Returns the longitude of a point
  def lon
    location&.longitude
  end
end