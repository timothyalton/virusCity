class Person < ApplicationRecord
    has_many :tiles, through: :action
end
