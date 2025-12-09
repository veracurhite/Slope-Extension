
let i: number=0
let slopesprite: Sprite
let slopesprites: Sprite[]
let os: Sprite
let i2: number
let i3: number

enum aorup {
    //% block="A"
    a,
    //% block="up"
    up,
    //% block="don't jump"
    noJump,
    //% block="both A and up"
    both
}

//% icon="\uf0d8"
//% color=#2222bb
//% block="Slopes"


namespace slopes {
    //% block="update collisions for $sprite tile size $size gravity $gravity move with controls $move speed $speed height $height jump with $jumpbutton bounce off vertical walls $bounce constant speed $constantspeed $convel have camera follow sprite $camera"
    //% sprite.defl=mySprite
    //% size.defl=16
    //% gravity.defl=0.3
    //% move.defl=false
    //% speed.defl=2
    //% height.defl=0
    //% bounce.defl=false
    //% constantspeed.defl=false
    //% convel.defl=0
    //% camera.defl=false
    export function collide(sprite: Sprite, size: number, gravity: number, move: boolean, speed: number, height: number, jumpbutton: aorup, bounce: boolean, constantspeed: boolean, convel: number, camera: boolean){
        sprites.changeDataNumberBy(sprite,"velocityY",gravity)
        for(i=0;i<sprites.allOfKind(SpriteKind.Slope).length;i+=1){
            os=sprites.allOfKind(SpriteKind.Slope)[i]
            if(sprite.overlapsWith(os)){
                sprites.setDataNumber(sprite, "velocityY", 0)
                sprite.bottom=os.top+1
                if (jumpbutton = aorup.a) {
                    if (controller.A.isPressed()) {
                        sprites.setDataNumber(sprite, "velocityY", height * -1)
                    }
                } else if (jumpbutton=aorup.up){
                    if (controller.up.isPressed()) {
                        sprites.setDataNumber(sprite, "velocityY", height * -1)
                    }
                }else if(jumpbutton=aorup.both){
                    if (controller.up.isPressed()||controller.A.isPressed()) {
                        sprites.setDataNumber(sprite, "velocityY", height * -1)
                    }
                }
            }
        }
        if (tiles.tileAtLocationIsWall(tiles.getTileLocation(Math.idiv(sprite.x, size), Math.idiv(sprite.y + sprite.height / 2, size)))) {
            sprites.setDataNumber(sprite, "velocityY", 0)
            sprite.bottom = tiles.getTileLocation(Math.idiv(sprite.x, size), Math.idiv(sprite.y + sprite.height / 2, size)).top
            if (jumpbutton = aorup.a) {
                if (controller.A.isPressed()) {
                    sprites.setDataNumber(sprite, "velocityY", height * -1)
                }
            } else if (jumpbutton = aorup.up) {
                if (controller.up.isPressed()) {
                    sprites.setDataNumber(sprite, "velocityY", height * -1)
                }
            } else if (jumpbutton = aorup.both) {
                if (controller.up.isPressed() || controller.A.isPressed()) {
                    sprites.setDataNumber(sprite, "velocityY", height * -1)
                }
            }
        }
        if (tiles.tileAtLocationIsWall(tiles.getTileLocation(Math.idiv(sprite.x, size), Math.idiv(sprite.y - sprite.height / 2, size)))&&sprites.readDataNumber(sprite,"velocityY")<0) {
            sprites.setDataNumber(sprite, "velocityY", 0)
            sprite.top = tiles.getTileLocation(Math.idiv(sprite.x, size), Math.idiv(sprite.y - sprite.height / 2, size)).bottom
        }
        if(constantspeed){
            if (!(sprites.readDataNumber(sprite, "velocityX") == convel || sprites.readDataNumber(sprite, "velocityX") == convel*-1)){
                sprites.setDataNumber(sprite, "velocityX", convel)
            }
        } else if (move) {
            if (controller.left.isPressed()) {
                sprites.setDataNumber(sprite, "velocityX", speed * -1)
            } else if (controller.right.isPressed()) {
                sprites.setDataNumber(sprite, "velocityX", speed)
            } else {
                sprites.setDataNumber(sprite, "velocityX", 0)
            }
        } else {
            sprites.setDataNumber(sprite, "velocityX", 0)
        }
        if (tiles.tileAtLocationIsWall(tiles.getTileLocation(Math.idiv(sprite.x + sprite.width / 2, size), Math.idiv(sprite.y, size)))&&sprites.readDataNumber(sprite,"velocityX")>0) {
            if(bounce){
                sprites.setDataNumber(sprite, "velocityX", sprites.readDataNumber(sprite,"velocityX")*-1)
            }else{
                sprites.setDataNumber(sprite, "velocityX", 0)
            }
            sprite.right = tiles.getTileLocation(Math.idiv(sprite.x + sprite.width / 2, size), Math.idiv(sprite.y, size)).left
        }
        if (tiles.tileAtLocationIsWall(tiles.getTileLocation(Math.idiv(sprite.x - sprite.width / 2, size), Math.idiv(sprite.y, size))) && sprites.readDataNumber(sprite, "velocityX") < 0) {
            if (bounce) {
                sprites.setDataNumber(sprite, "velocityX", sprites.readDataNumber(sprite, "velocityX") * -1)
            } else {
                sprites.setDataNumber(sprite, "velocityX", 0)
            }
            sprite.left = tiles.getTileLocation(Math.idiv(sprite.x - sprite.width / 2, size), Math.idiv(sprite.y, size)).right
        }
        sprite.x+=sprites.readDataNumber(sprite,"velocityX")
        sprite.y += sprites.readDataNumber(sprite, "velocityY")
        if(camera){
            scene.centerCameraAt(sprite.x,sprite.y)
        }
    }
    //% block="create slopes with slope tiles left $LeftSlopeImg right $RightSlopeImg"
    export function create(LeftSlopeImg: Image, RightSlopeImg: Image){
        if(LeftSlopeImg.height==LeftSlopeImg.width&&RightSlopeImg.height==RightSlopeImg.width&&LeftSlopeImg.width==RightSlopeImg.height){
            if(LeftSlopeImg.height==16){
                for(i2=0;i<tiles.getTilesByType(LeftSlopeImg).length;i+=1){
                    for(i=16;i>0;i-=1){
                        console.log("CREATING SLOPE AT IMG " + i)
                        slopesprite=sprites.create(image.create(i,1),SpriteKind.Slope)
                        slopesprite.image.drawTransparentImage(LeftSlopeImg, 0, (i - 1) * -1)
                        tiles.placeOnTile(slopesprite,tiles.getTilesByType(LeftSlopeImg)[i2])
                        slopesprite.left = tiles.getTilesByType(LeftSlopeImg)[i2].left
                        slopesprite.top = tiles.getTilesByType(LeftSlopeImg)[i2].top+i-1
                        console.log("TOP, LEFT " + slopesprite.top + " , " + slopesprite.left)
                    }
                }
                for (i2 = 0; i < tiles.getTilesByType(RightSlopeImg).length; i += 1) {
                    for (i = 16; i > 0; i -= 1) {
                        console.log("CREATING SLOPE AT IMG " + i)
                        slopesprite = sprites.create(image.create(i, 1), SpriteKind.Slope)
                        slopesprite.image.drawTransparentImage(RightSlopeImg, 0, (i - 1)*-1)
                        tiles.placeOnTile(slopesprite, tiles.getTilesByType(RightSlopeImg)[i2])
                        slopesprite.right = tiles.getTilesByType(RightSlopeImg)[i2].right
                        slopesprite.top = tiles.getTilesByType(RightSlopeImg)[i2].top + i - 1
                        console.log("TOP, LEFT " + slopesprite.top + " , " + slopesprite.left)
                    }
                }
            } else if (LeftSlopeImg.height == 8){
                for (i2 = 0; i < tiles.getTilesByType(LeftSlopeImg).length; i += 1) {
                    for (i = 8; i > 0; i -= 1) {
                        console.log("CREATING SLOPE AT IMG " + i)
                        slopesprite = sprites.create(image.create(i, 1), SpriteKind.Slope)
                        slopesprite.image.drawTransparentImage(LeftSlopeImg, 0, (i - 1)*-1)
                        tiles.placeOnTile(slopesprite, tiles.getTilesByType(LeftSlopeImg)[i2])
                        slopesprite.left = tiles.getTilesByType(LeftSlopeImg)[i2].left
                        slopesprite.top = tiles.getTilesByType(LeftSlopeImg)[i2].top + i - 1
                        console.log("TOP, LEFT " + slopesprite.top + " , " + slopesprite.left)

                    }
                }
                for (i2 = 0; i < tiles.getTilesByType(RightSlopeImg).length; i += 1) {
                    for (i = 8; i > 0; i -= 1) {
                        console.log("CREATING SLOPE AT IMG " + i)
                        slopesprite = sprites.create(image.create(i, 1), SpriteKind.Slope)
                        slopesprite.image.drawTransparentImage(RightSlopeImg, 0, (i - 1) * -1)
                        tiles.placeOnTile(slopesprite, tiles.getTilesByType(RightSlopeImg)[i2])
                        slopesprite.right = tiles.getTilesByType(RightSlopeImg)[i2].right
                        slopesprite.top = tiles.getTilesByType(RightSlopeImg)[i2].top + i - 1
                        console.log("TOP, LEFT " + slopesprite.top + " , " + slopesprite.left)

                    }
                }
            }else{
                throw "Slope images must be 16x16 or 8x8"
            }
        }else{
            throw "Slope images must be uniform"
        }
    }
    //% block="Destroy all offscreen slopes"
    export function destroyoffscreen(){
        slopesprites = sprites.allOfKind(SpriteKind.Slope)
        for(i=0;i<sprites.allOfKind(SpriteKind.Slope).length;i+=1){
            os=slopesprites[i]
            if (os.x + os.width > scene.cameraProperty(CameraProperty.X) + image.getDimension(image.screenImage(), image.Dimension.Width) / 2 || os.x - os.width < scene.cameraProperty(CameraProperty.X) - image.getDimension(image.screenImage(), image.Dimension.Width) / 2 || os.y + os.height > scene.cameraProperty(CameraProperty.Y) + image.getDimension(image.screenImage(), image.Dimension.Height) / 2 || os.y - os.height < scene.cameraProperty(CameraProperty.Y) - image.getDimension(image.screenImage(), image.Dimension.Height) / 2) {
                sprites.destroy(os)
            }
        }
    }
    //% block="Destroy all slopes"
    export function destroy(){
        sprites.destroyAllSpritesOfKind(SpriteKind.Slope)
    }
    //% block="Update slopes left slope image $lsi right image $rsi"
    export function update(lsi: Image, rsi: Image){
        slopes.destroy()
        slopes.create(lsi,rsi)
        slopes.destroyoffscreen()
    }
}