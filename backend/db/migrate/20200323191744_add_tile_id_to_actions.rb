class AddTileIdToActions < ActiveRecord::Migration[6.0]
  def change
    add_column :actions, :tile_id, :integer
  end
end
