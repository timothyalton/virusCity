class PersonSerializer < ActiveModel::Serializer
  attributes :id , :name , :health
  has_many :actions
  belongs_to :tile
end
