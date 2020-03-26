class GridSerializer < ActiveModel::Serializer
  attributes :id, :size
  has_many :tiles
end
