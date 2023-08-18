
import { Html, useProgress } from "@react-three/drei";

const CanvasLoader = () => {
  const { progress } = useProgress();
  
  return (
    <Html center>
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}>
        <span className='canvas-loader'></span>
        <p style={{
          fontSize: 18,
          color: "#F1F1F1",
          fontWeight: 800,
          marginTop: 40,
        }}>
          {progress.toFixed(2)}%
        </p>
      </div>
    </Html>
  );
};

export default CanvasLoader;
