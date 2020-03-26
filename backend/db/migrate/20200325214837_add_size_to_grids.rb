class AddSizeToGrids < ActiveRecord::Migration[6.0]
  def change
    add_column :grids, :size, :integer
  end
end
