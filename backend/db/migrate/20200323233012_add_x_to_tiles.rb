class AddXToTiles < ActiveRecord::Migration[6.0]
  def change
    add_column :tiles, :x, :integer
  end
end
