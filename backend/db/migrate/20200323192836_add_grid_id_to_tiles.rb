class AddGridIdToTiles < ActiveRecord::Migration[6.0]
  def change
    add_column :tiles, :grid_id, :integer
  end
end
