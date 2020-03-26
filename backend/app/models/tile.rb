class Tile < ApplicationRecord
    belongs_to :grid
    has_many :actions
    has_many :people, through: :actions
end
