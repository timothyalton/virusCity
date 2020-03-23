class CreateActions < ActiveRecord::Migration[6.0]
  def change
    create_table :actions do |t|
      t.string :time
      t.string :integer

      t.timestamps
    end
  end
end
