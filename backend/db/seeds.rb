
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


g1 = Grid.create()

Tile.create(x:6, y:23 , property: 3, grid_id: g1.id)
Tile.create(x:6, y:34 , property: 2, grid_id: g1.id)
Tile.create(x:3, y:45 , property: 3, grid_id: g1.id)
Tile.create(x:45, y:54 , property: 5, grid_id: g1.id)
Tile.create(x:23, y:13 , property: 2, grid_id: g1.id)
Tile.create(x:4, y:13 , property: 3, grid_id: g1.id)
Tile.create(x:45, y:2 , property: 12, grid_id: g1.id)

