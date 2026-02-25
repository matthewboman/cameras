class IceDataset < ApplicationRecord

  scope :by_categories, -> (categories) {
    return self if categories.blank?

    cat = categories.is_a?(String) ? categories.split(",") : Array(categories)

    self.where(category: cat)
  }

  scope :by_date, -> (start_date, end_date) {
    if start_date.present? && end_date.present?
      self.where(spotted_on: start_date..end_date)
    elsif start_date.present?
      self.where("spotted_on >= ?", start_date)
    elsif end_date.present?
      self.where("spotted_on <= ?", end_date)
    else
      self
    end
  }

  scope :by_coordinates, -> (min_lat, min_lng, max_lat, max_lng) {
    self.where(
      "location && ST_MakeEnvelope(?, ?, ?, ?, 4326)::geography",
      min_lng, min_lat, max_lng, max_lat
    )
  }

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