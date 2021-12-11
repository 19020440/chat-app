import React, { useEffect, useRef } from 'react';
//import logo from './logo.svg';
import {bg,fg, bird0, bird1, bird2, pipeN, pipeS, gameover, _ok_, splash, ready} from '../../common/Sprite';
import {width, height} from '../../common/common';
import { observer } from 'mobx-react-lite';
import {rungame, states, resetGame} from '../../Store/store';
import './bird.css'
const SpriteWrapper = observer(props => {


    const gameSprite = props.gameSprite;
    const rotate = 'rotate('+ gameSprite.rotation +'rad)'
    const translate = 'translate(' + gameSprite.cx + 'px,' + gameSprite.cy + 'px)'
    const ctrans = (gameSprite.rotation == null) ? translate : translate + ' ' + rotate;
    const onClickHandler = (props.onClickHandler) == null ? null : props.onClickHandler;
    const style = {
      transform: ctrans,
      position: 'absolute'
    }

    return (
      <div style={style} onClick={onClickHandler}>
        {props.children}
      </div>)

})

const Bg = observer(
    props => {
      return <SpriteWrapper gameSprite={props.bg}> {bg} </SpriteWrapper>;

})

const Fg = observer(
    props => {
      return <SpriteWrapper gameSprite={props.fg}> {fg} </SpriteWrapper>;

})

export const Bird = observer(
    props => {

          let wbird;
          switch(props.bird.frame) {
            case 1:
            case 3:
              wbird = bird1
              break
            case 2:
              wbird = bird2
              break
            case 0:
            default:
              wbird = bird0
              break
          }

          return <SpriteWrapper gameSprite={props.bird}> {wbird} </SpriteWrapper>;
      }
)

const Pipe = observer(
    props => {
    let wpipe;
    switch(props.pipe.type) {
      default:
      case "N":
        wpipe = pipeN
        break
      case "S":
        wpipe = pipeS
        break
    }

    return <SpriteWrapper gameSprite={props.pipe}> {wpipe} </SpriteWrapper>;


})

const Gameover = observer(
    props => {

      return <SpriteWrapper gameSprite={{cx: width/2 - 94, cy: height-400}}> {gameover} </SpriteWrapper>;

})

export const OK = observer(
props => {
      return <SpriteWrapper gameSprite={{cx: width/2 - 40, cy: height-340}} onClickHandler={rungame} > {_ok_} </SpriteWrapper>;

})

export const Splash = observer(
    props => {

      return <SpriteWrapper gameSprite={{cx: width/2 - 59, cy: height-300}}> {splash} </SpriteWrapper>;

})

export const Ready = observer(
    props => {


      return <SpriteWrapper gameSprite={{cx: width/2 - 87, cy: height-380}}> {ready} </SpriteWrapper>;


})

const FlappyBird = observer(props => {
    const req = useRef();
    useEffect(() => {
        console.log("begin");
        req.current = window.requestAnimationFrame(appUpdateFrame)
        return () => {
            console.log("end");
            resetGame();
            window.cancelAnimationFrame(req.current);
        }
  }, [])

  //Call to store to update the frame
  const appUpdateFrame = () => {
    
    props.updateFrame(); //will trigger mobx to update the view when observable value change

    req.current = window.requestAnimationFrame(appUpdateFrame) //rerun function again when browser is ready to update new frame

  }

    const {bgs, fgs, bird, pipes} = props.store
    const { currentstate } = props.game;

    const style = {
      width: width,
      height: height
    }

    return (
      <div className="App" id="fakingcanvas" style={style}>
      { bgs.map( (bg) => ( <Bg bg={bg} key={bg.id} /> )     )}
      { pipes.map( (pipe) => (  <Pipe pipe={pipe} key={pipe.id} /> )   )}
      <Bird bird={bird} />
      { (currentstate === states.Score) ? <Gameover /> : null }
      { (currentstate === states.Score) ? <OK /> : null }
      { (currentstate === states.Splash) ? <Splash /> : null }
      { (currentstate === states.Splash) ? <Ready /> : null }
      { fgs.map( (fg) => ( <Fg fg={fg} key={fg.id} /> )     )}
      
      </div>
    );
})

export default FlappyBird
