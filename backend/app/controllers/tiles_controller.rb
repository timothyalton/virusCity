class TilesController < ApplicationController
    def index
        tiles = Tile.all  
        render json: tiles 
    end 

    def show
        tile = Tile.find(params[:id])
        render json: tile
    end 

    def new

    end 

    def create
         tile = Tile.create(tile_params)
         render json: tile
    end 

    def edit 
        tile = Tile.find(params[:id])
    end 

    def update
        tile = Tile.find(params[:id])
        tile.update(tile_params) 
        render json: tile 
    end 


    private 
    def tile_params 
        params.require(:tile).permit(:x, :y, :property)
    end 
end
