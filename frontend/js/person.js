function addperson(x, y) {
    people.push({ pos: [x, y], path: [] })
}









//path finding strategy

// which tile we can walk on 
// which direction we can walk through 
// road foes from left to right we can walk from left to right but not right to left 



// methed to see where we can walk , if we standing on a tile which nighbor tile we can walk to
//for each tile  we have 4 nighbour tile up , down , left , right 
// we need two things to know, the current tile what property it is , and what is the nighbor proprty
// I can only leave my current tile to any of the avaliable nighbour tile if they have an entrence
// for each property texture will create array to set an boolean value for the 4 edges if its true or false to go out or in from it
//write a function to give us all nighbor for a specific tile 
// to get specif tile nighbour it will be current tile(x,y) => [x-1,y] , [x+1,y] , [x, y+1] , [x ,y-1] //funtion return for me all VALID nighbour 
// first I need to check if i can leave my current tile 


// when a naighbor will be a VALID nighbour : 
// i need to check if the way i can leave my current tile 
// 1)if I can exsit my tile from specific direction
// 2)nighbour is exsist on that direction (not an boarder to jumb)
// 3)if nighbour have true on the oppsite dirction

//movetotile function to assign the destintion