import * as React from "react";
import { Text, View } from "react-native";
import {
  PinchGestureHandler,
  PinchGestureHandlerStateChangeEvent,
  State,
} from "react-native-gesture-handler"; // Import gesture handler components
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer } from "expo-three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Asset } from "expo-asset";
// import { OrbitControls } from "@react-three/drei";
// import { Canvas } from "@react-three/fiber";

const carModelPaths = {
  benz: require("../assets/sonata.obj"),
  etron: require("../assets/etron.obj"),
  civic: require("../assets/civic.obj"),
  golf: require("../assets/golf.obj"),
  class: require("../assets/etron.obj"),
  lancer: require("../assets/etron.obj"),
  sonata: require("../assets/sonata.obj"),
  glory: require("../assets/civic.obj"),
  default: require("../assets/civic.obj"),

  // Add more car models here as needed
};

const CarViewer = ({ car }) => {
  const [modelLoaded, setModelLoaded] = React.useState(null);
  const [loadedModel, setLoadedModel] = React.useState("");
  const [isLoading, setLoading] = React.useState(true);
  const [isMoving, setMoving] = React.useState(false);
  const [name, setName] = React.useState("");
  const [initialTouchPosition, setInitialTouchPosition] = React.useState({
    x: 0,
    y: 0,
  });
  const [currentTouchPosition, setCurrentTouchPosition] = React.useState({
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
    const loadModel = async () => {
      const { model } = car;
      setName(model.toLowerCase());
      if (!modelLoaded) {
        const asset = Asset.fromModule(carModelPaths[model.toLowerCase()]);

        console.log("Downloading asset...");
        await asset.downloadAsync();
        console.log("Asset downloaded.");

        const loader = new OBJLoader();
        loader.load(
          asset.localUri,
          (object) => {
            console.log("3D model loaded");
            object.rotation.set(0, 0, 0);
            setModelLoaded(object);
            setLoading(false);
          },
          (xhr) => {
            console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
          },
          (error) => {
            console.error("Error loading 3D model:", error);
            setLoading(false);
          }
        );
      }
    };

    loadModel();
  }, [modelLoaded]);

  const handleTouchStart = (event) => {
    const { nativeEvent } = event;
    setInitialTouchPosition({
      x: nativeEvent.locationX,
      y: nativeEvent.locationY,
    });
    setCurrentTouchPosition({
      x: nativeEvent.locationX,
      y: nativeEvent.locationY,
    });
    setMoving(true);
  };

  const handleTouchMove = (event) => {
    if (isMoving) {
      const { nativeEvent } = event;
      const deltaX = nativeEvent.locationX - currentTouchPosition.x;
      const deltaY = nativeEvent.locationY - currentTouchPosition.y;

      if (modelLoaded) {
        const { rotation } = modelLoaded;
        rotation.x -= deltaY * 0.01; // Adjust the sensitivity as needed
        rotation.y += deltaX * 0.01; // Adjust the sensitivity as needed
      }

      setCurrentTouchPosition({
        x: nativeEvent.locationX,
        y: nativeEvent.locationY,
      });
    }
  };

  const handleTouchEnd = () => {
    setMoving(false);
  };
  const [scale, setScale] = React.useState(1); // Initial scale factor
  const [baseScale, setBaseScale] = React.useState(1); // Store the base scale

  const handlePinch = (event: PinchGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      // Calculate the new scale factor
      const newScale = baseScale * event.nativeEvent.scale;

      // Limit the scale factor to avoid zooming too close or too far
      const minScale = 0.5; // Minimum scale
      const maxScale = 2; // Maximum scale

      if (newScale >= minScale && newScale <= maxScale) {
        setScale(newScale);
      }
    } else if (event.nativeEvent.state === State.END) {
      // Store the current scale as the base scale
      setBaseScale(scale);
    }
  };
  return (
    <GestureHandlerRootView>
    <View>
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Loading...</Text>
        </View>
      ) : (
        <PinchGestureHandler
          onGestureEvent={handlePinch}
          onHandlerStateChange={handlePinch}
        >
          <GLView
            style={{
              aspectRatio: 1,
              borderBottomWidth: 1,
              borderTopWidth: 1,
            }}
            onContextCreate={(gl: ExpoWebGLRenderingContext) => {
              const renderer = new Renderer({ gl });
              renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
              const scene = new THREE.Scene();
              const light = new THREE.DirectionalLight(0xffffff, 1);
              scene.background = new THREE.Color(0xeeeeee);

              light.position.set(0, 1, 0);
              scene.add(light);
                let camera;
                if(name === "civic" || name === "etron"){
                 camera = new THREE.PerspectiveCamera(
                  15,
                  gl.drawingBufferWidth / gl.drawingBufferHeight,
                  0.1,
                  1000
                );
                camera.position.set(0, 1, 20);
                camera.lookAt(0, 1, 20);
              }
              else{
                 camera = new THREE.PerspectiveCamera(
                  50,
                  gl.drawingBufferWidth / gl.drawingBufferHeight,
                  0.1,
                  1000
                );
                camera.position.set(1, 0, 15);
                camera.lookAt(1, 0, 15);
              }
              const animate = () => {
                if (modelLoaded && isMoving) {
                  const { rotation } = modelLoaded;
                  rotation.z += 0.005; // You can add rotation here without touch
                }

                if (modelLoaded) {
                  const { rotation } = modelLoaded;
                  scene.add(modelLoaded);
                  renderer.render(scene, camera);
                }

                gl.endFrameEXP();
                requestAnimationFrame(animate);
              };
              animate();
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            
          />
           

        </PinchGestureHandler>
      )}
    </View>
    </GestureHandlerRootView>
  );
};

export default CarViewer;
