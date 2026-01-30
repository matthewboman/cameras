class IceDataset < ApplicationRecord

  # Returns the latitude of a point
  def lat
    location&.latitude
  end

  # Returns the longitude of a point
  def lon
    location&.longitude
  end
end