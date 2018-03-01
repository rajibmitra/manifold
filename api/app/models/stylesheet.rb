# A stylesheet
class Stylesheet < ApplicationRecord

  # Concerns
  include TrackedCreator

  # Authorization
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  # Associations
  belongs_to :text
  has_one :project, through: :text
  belongs_to :ingestion_source, optional: true

  # Validations
  validates :name, presence: true

  # AR Callbacks
  before_save :revalidate, if: :raw_styles_changed?

  # Concerns
  acts_as_list scope: :text_id

  def to_s
    "stylesheet #{id}"
  end

  def revalidate
    self.styles = ::Validator::Stylesheet.new.validate(raw_styles)
  end

end
