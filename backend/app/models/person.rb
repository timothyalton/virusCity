class Person < ApplicationRecord
    has_many :actions
    has_many :tiles, through: :action
    belongs_to :tile
end
