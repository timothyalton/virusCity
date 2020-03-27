class PersonSerializer < ActiveModel::Serializer
  attributes :id , :name , :health , :tile_id 
  has_many :actions
  belongs_to :tile
end
