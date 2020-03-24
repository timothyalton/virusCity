class AddYToTiles < ActiveRecord::Migration[6.0]
  def change
    add_column :tiles, :y, :integer
  end
end
