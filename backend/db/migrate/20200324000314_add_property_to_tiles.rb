class AddPropertyToTiles < ActiveRecord::Migration[6.0]
  def change
    add_column :tiles, :property, :integer
  end
end
