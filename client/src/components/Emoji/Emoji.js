import React, {useState} from 'react';
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import { set } from 'lodash';
function Emoji({getText}) {
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [emoJi,setEmoJi] = useState('');
    const onEmojiClick = (event, emojiObject) => {
        // setEmoJi(prev => prev+emojiObject.emoji)
        // setChosenEmoji(emojiObject);
        getText(emojiObject.emoji)
    }
    const handleDelete = (e) => {
        // if(e.which == 8 && emoJi != "" ) {
        //         let emojisArray = emoJi.match(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g)
        //         emojisArray = emojisArray.splice(0, emojisArray.length - 1);
        //         setEmoJi(emojisArray.join("") ) 
        // } else 
        // setEmoJi(e.target.value)
    }
    return (
            
        <div style={{textAlign: 'center'}}>
            <Picker  onEmojiClick={onEmojiClick} skinTone={SKIN_TONE_MEDIUM_DARK}/>
            {/* { chosenEmoji && <EmojiData chosenEmoji={chosenEmoji}/>} */}
            {/* <input type="text" value={emoJi} onChange={handleDelete}/>
            <span>{emoJi}</span> */}
        </div>
    );
}

const EmojiData = ({chosenEmoji}) => (
    <div style={{textAlign: 'center',marginRight: '810px'}}>
      <br></br>
      <br></br>
      <hr></hr>
      <strong>Names:</strong> {chosenEmoji.names.join(', ')}<br/>
      <strong>Symbol:</strong> {chosenEmoji.emoji}<br/>
    </div>
  );

export default Emoji;