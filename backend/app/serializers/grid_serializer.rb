class GridSerializer < ActiveModel::Serializer
  attributes :id
  has_many :tiles
end
