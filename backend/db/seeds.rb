Grid.destroy_all
Tile.destroy_all


# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


g1 = Grid.create()

size = 50
(0..size-1).each do |row| 
    (0..size-1).each do |col|
        Tile.create(x:row ,y:col, property: 0, grid_id: g1.id)
    end 
end


