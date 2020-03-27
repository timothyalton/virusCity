class PeopleController < ApplicationController
    
    before_action :find_person, only: [:show, :edit, :update, :destroy]

    def index
        people = Person.all
        render json: people 
    end

    def show
        # person = Person.find(params[:id])
        render json: @person
    end

    def new 

    end

    def create 
        buildings = Tile.all.filter do |tile|
        tile.property > 53 || tile.property == 46 || tile.property == 47
        end     
        person = Person.create(person_params)
       4.times do 
            Action.create({
              time: Faker::Number.between(from: 0, to: 1440),
              category: ["go to work","go to school","go shopping"][rand(3)],
              tile: buildings[rand(buildings.length)],
              person: person
            })
          end
        
        render json: person 
        
    end

    def edit
        # person = Person.find(params[:id])
    end

    def update
        # person = Person.find(params[:id])
        person.update(person_params)
        render json: person 
    end

    def destroy
        # person = Person.find(params[:id])
        person.destroy
    end

    private

    def person_params
        params.require(:person).permit(:name, :health,  :tile_id)
    end

    def find_person
        @person = Person.find(params[:id])
    end
end
