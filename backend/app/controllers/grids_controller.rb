class GridsController < ApplicationController

    before_action :find_grid, only: [:show, :edit, :update, :destroy]

    def index 
        grids = Grid.all
    end
    
    def show
        # grid = Grid.find(params[:id])
        render json: grid
    end 

    def new

    end 

    def create
         grid = Grid.create(grid_params)
         render json: grid
    end 

    def edit 
        # grid = Grid.find(params[:id])
    end 

    def update
        # grid = Grid.find(params[:id])/
        grid.update(grid_params) 
        render json: grid
    end 


    private 
    def grid_params 
        params.require(:grid).permit(:tiles)
    end 

    def find_grid
        grid = Grid.find(params[:id])
    end

end
