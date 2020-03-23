class AddTileIdToPeople < ActiveRecord::Migration[6.0]
  def change
    add_column :people, :tile_id, :integer
  end
end
