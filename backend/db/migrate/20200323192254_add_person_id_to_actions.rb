class AddPersonIdToActions < ActiveRecord::Migration[6.0]
  def change
    add_column :actions, :person_id, :integer
  end
end
