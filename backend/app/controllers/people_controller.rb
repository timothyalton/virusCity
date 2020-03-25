class PeopleController < ApplicationController
    
    before_action :find_person, only: [:show, :edit, :update, :destroy]

    def index
        people = Person.all
        render json: people 
    end

    def show
        # person = Person.find(params[:id])
        render json: person
    end

    def new 

    end

    def create 
        person = Person.create(person_params)
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
        params.require(:person).permit(:name, :health)
    end

    def find_person
        person = Person.find(params[:id])
    end
end
