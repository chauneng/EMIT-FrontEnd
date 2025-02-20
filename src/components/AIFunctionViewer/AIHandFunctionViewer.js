import Webcam from "react-webcam";
// import { HandPoseWorkerManager, generateDefaultHandPoseParams, generateHandPoseDefaultConfig } from '@dannadori/handpose-worker-js';
import { useEffect, useRef, useState } from "react";
import Capture from "./Capture";
import Draggable from "react-draggable";
import {connect} from "react-redux";
const height = document.documentElement.scrollHeight;
const width = document.documentElement.scrollWidth;

function AIHandFunctionViewer ({
  timerOn, 
  setTimerOn, 
  userTimerOn,
  setUserTimerOn,
  useHandAi,
  setUseHandAi,
  handManager,
  handParams,
}){
  const webcamRef = useRef(null);
  const srcCanvas = document.getElementById("srccanvas");
  const dstCanvas = document.getElementById("dstcanvas");
  const getHandImage = document.getElementById("imgHand");
  const videoConstraints = {
    width: 220,
    height: 200,
    facingMode: "user"
  };
  // const [saveManager,setSaveManager] = useState();
  const [handImage,setHandImage] = useState("");
  const [handInterval, setHandInterval] = useState(null);

  // const config = generateHandPoseDefaultConfig();
  // config.model.detectionConfidence = 0.6;
  // config.useTFWasmBackend = true;
  // const params = generateDefaultHandPoseParams();
  
  // useEffect(()=>{
  //   const manager = new HandPoseWorkerManager();
  //   console.log("hand model",config);
  //   manager.init(config);
  //   setSaveManager(manager);
  //   // Capture();
  // },[]);

  useEffect(()=>{
    if (handInterval && useHandAi) {
      clearInterval(handInterval);
    }
    else if (useHandAi && !handInterval) {
      setHandInterval(Capture("Hand"));
    }
  },[useHandAi]);

  useEffect(async()=>{
    if(userTimerOn){
        
      if(getHandImage !== null){      
        const srcCanvas2d = srcCanvas.getContext("2d");
        srcCanvas2d.drawImage(getHandImage,0,0,srcCanvas.width,dstCanvas.height);
        const result = await handManager.predict(srcCanvas,handParams);
        console.log(result);
        if(result !== null && result.length === 0 && timerOn === true){
          setTimerOn(false);
          // clearInterval(aiInterval);
        }
        else if(result !== null && result.length !== 0 && timerOn === false){
        
          setTimerOn(true);  
          
        }
        // else if(result !== null && result.length !== 0 && timerOn === true){
        //   if(result[0].faceInViewConfidence < 0.95){
        //     setTimerOn(false);
        //     // clearInterval(aiInterval);
        //   }
        // }
      }
    }
  },[handImage]);
    
  const capture = () => {
    // console.log(webcamRef.current);
    if(webcamRef.current !== null){

      const imgSrc = webcamRef.current.getScreenshot();
      // console.log(imgSrc);
      document.getElementById("imgHand").src = imgSrc;
      // console.log(document.getElementById("img").src,"캡쳐완료");
      setHandImage(imgSrc);

    }
  };

  
  return(
    <>
        <Draggable
          bounds={{top : (270-height), bottom : 30, right : 40, left : (350-width)}}
          // bounds="body"
          // defaultPosition={{x:30,y:30}}
        >
          <Webcam
            ref={webcamRef}
            audio={false}
            height={240}
            screenshotFormat="image/jpeg"
            width={320}          
            videoConstraints={videoConstraints}
            imageSmoothing={true}
            style={{
              cursor: "move"
            }}
          />
        </Draggable>
        <> 
          <canvas id="srccanvas"
            style={{
              // position: "absolute",
              // width: "320",
              // height: "240",
              display : "none"
            }}
          ></canvas>
          <canvas id="dstcanvas"
            style={{
              // position: "absolute",
              // width: "320",
              // height: "240",
              display : "none"
            }}
          ></canvas>
          <img id="imgHand" src={handImage} style={{
              width: "320",
              height: "240",
              display: "none"
            }}></img>
          <button id="captureHand" style={{display: "none"}} onClick={(e)=>{capture();}}>Capture</button>
        </>
    </>
  );
}

function mapStateToProps(state){
  return{
      handManager : state.handManager,
      handParams : state.handParams,
  };
}

export default connect(mapStateToProps) (AIHandFunctionViewer);