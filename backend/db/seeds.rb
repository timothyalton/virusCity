#Grid.destroy_all
#Tile.destroy_all
Person.destroy_all
Action.destroy_all


# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


g1 = Grid.create(size: 20)
buildings = []

(0..g1.size-1).each do |row| 
    (0..g1.size-1).each do |col|
      if(rand(100)<20)
        buildings << Tile.create(x:row ,y:col, property: 54 + rand(18), grid_id: g1.id)
      else
        Tile.create(x:row ,y:col, property: 0, grid_id: g1.id)
      end
    end 
end





30.times do 
    Person.create({
      name: Faker::Name.name,
      health: "healthy",
      tile: buildings[rand(buildings.length)]
    })
  end

  5.times do 
    Person.create({
      name: Faker::Name.name,
      health: "infected",
      tile: buildings[rand(buildings.length)]
    })
  end

  120.times do 
    Action.create({
      time: Faker::Number.between(from: 0, to: 1440),
      category: ["go to work","go to school","go shopping"][rand(3)],
      tile: buildings[rand(buildings.length)],
      person: Person.all[rand(Person.all.length)]
    })
  end



