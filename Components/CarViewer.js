// import * as React from 'react';
// import { Text, View } from 'react-native';
// import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
// import { Renderer } from 'expo-three';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { Asset } from 'expo-asset';

// const CarViewer = ({car}) => {
//   const [modelLoaded, setModelLoaded] = React.useState(null);
//   const [isLoading, setLoading] = React.useState(true);
//   const [isMoving, setMoving] = React.useState(false);
//   const [initialTouchPosition, setInitialTouchPosition] = React.useState({ x: 0, y: 0 });
//   const [currentTouchPosition, setCurrentTouchPosition] = React.useState({ x: 0, y: 0 });

//   React.useEffect(() => {
//     const loadModel = async () => {
//       let filename = car.model.toLowerCase();
    
//       if (!modelLoaded) {
//         let asset;
    
//         try {
//           asset = await Asset.fromModule(require(`../assets/${filename}.obj`));
//         } catch (error) {
//           // Handle the error when the specified model is not found
//           // filename = 'benz'; // Use the default model filename
//           asset = await Asset.fromModule(require(`../assets/benz.obj`));
//         }
    
//         console.log('Downloading asset...');
//         await asset.downloadAsync();
//         console.log('Asset downloaded.');
    
//         const loader = new OBJLoader();
//         loader.load(
//           asset.localUri,
//           (object) => {
//             console.log('3D model loaded');
//             object.rotation.set(0, 0, 0);
//             setModelLoaded(object);
//             setLoading(false);
//           },
//           (xhr) => {
//             console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
//           },
//           (error) => {
//             console.error('Error loading 3D model:', error);
//             setLoading(false);
//           }
//         );
//       }
//     };
    

//     loadModel();
//   }, [modelLoaded]);

//   const handleTouchStart = (event) => {
//     const { nativeEvent } = event;
//     setInitialTouchPosition({ x: nativeEvent.locationX, y: nativeEvent.locationY });
//     setCurrentTouchPosition({ x: nativeEvent.locationX, y: nativeEvent.locationY });
//     setMoving(true);
//   };

//   const handleTouchMove = (event) => {
//     if (isMoving) {
//       const { nativeEvent } = event;
//       const deltaX = nativeEvent.locationX - currentTouchPosition.x;
//       const deltaY = nativeEvent.locationY - currentTouchPosition.y;

//       if (modelLoaded) {
//         const { rotation } = modelLoaded;
//         rotation.x -= deltaY * 0.01; // Adjust the sensitivity as needed
//         rotation.y += deltaX * 0.01; // Adjust the sensitivity as needed
//       }

//       setCurrentTouchPosition({ x: nativeEvent.locationX, y: nativeEvent.locationY });
//     }
//   };

//   const handleTouchEnd = () => {
//     setMoving(false);
//   };

//   return (
//     <View>
//       {isLoading ? (
//         <View
//           style={{
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}
//         >
//           <Text>Loading...</Text>
//         </View>
//       ) : (
//         <View>
//           <GLView
//             style={{
//               aspectRatio: 1,
//               borderBottomWidth: 1,
//               borderTopWidth: 1,
//             }}
//             onContextCreate={(gl: ExpoWebGLRenderingContext) => {
//               const renderer = new Renderer({ gl });
//               renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
//               const scene = new THREE.Scene();
//               const light = new THREE.DirectionalLight(0xffffff, 1);
//               scene.background = new THREE.Color(0xeeeeee);

//               light.position.set(0, 1, 0);
//               scene.add(light);

//               const camera = new THREE.PerspectiveCamera(
//                 80,
//                 gl.drawingBufferWidth / gl.drawingBufferHeight,
//                 0.1,
//                 1000
//               );
//               camera.position.set(0, 1, 5);
//               camera.lookAt(0, 1, 0);

//               const animate = () => {
//                 if (modelLoaded && isMoving) {
//                   const { rotation } = modelLoaded;
//                   rotation.z += 0.005; // You can add rotation here without touch
//                 }

//                 if (modelLoaded) {
//                   const { rotation } = modelLoaded;
//                   scene.add(modelLoaded);
//                   renderer.render(scene, camera);
//                 }

//                 gl.endFrameEXP();
//                 requestAnimationFrame(animate);
//               };
//               animate();
//             }}
//             onTouchStart={handleTouchStart}
//             onTouchMove={handleTouchMove}
//             onTouchEnd={handleTouchEnd}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// export default CarViewer;
import * as React from 'react';
import { Text, View } from 'react-native';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Asset } from 'expo-asset';

const carModelPaths = {
  benz: require('../assets/sonata.obj'),
  etron: require('../assets/etron.obj'),
  civic: require('../assets/civic.obj'),
  golf: require('../assets/golf.obj'),
  class: require('../assets/sonata.obj'),
  lancer: require('../assets/lancer.obj'),
  sonata: require('../assets/sonata.obj'),
  glory: require('../assets/lancer.obj'),
  default: require('../assets/lancer.obj')
  

  // Add more car models here as needed
};

const CarViewer = ({ car }) => {
  const [modelLoaded, setModelLoaded] = React.useState(null);
  const [loadedModel, setLoadedModel] = React.useState("");
  const [isLoading, setLoading] = React.useState(true);
  const [isMoving, setMoving] = React.useState(false);
  const [initialTouchPosition, setInitialTouchPosition] = React.useState({ x: 0, y: 0 });
  const [currentTouchPosition, setCurrentTouchPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const loadModel = async () => {
      const { model } = car;

      if (!modelLoaded) {
        const asset = Asset.fromModule(carModelPaths[model.toLowerCase()]);
        
        console.log('Downloading asset...');
        await asset.downloadAsync();
        console.log('Asset downloaded.');

        const loader = new OBJLoader();
        loader.load(
          asset.localUri,
          (object) => {
            console.log('3D model loaded');
            object.rotation.set(0, 0, 0);
            setModelLoaded(object);
            setLoading(false);
          },
          (xhr) => {
            console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
          },
          (error) => {
            console.error('Error loading 3D model:', error);
            setLoading(false);
          }
        );
      }
    };

    loadModel();
  }, [modelLoaded]);

  const handleTouchStart = (event) => {
    const { nativeEvent } = event;
    setInitialTouchPosition({ x: nativeEvent.locationX, y: nativeEvent.locationY });
    setCurrentTouchPosition({ x: nativeEvent.locationX, y: nativeEvent.locationY });
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

      setCurrentTouchPosition({ x: nativeEvent.locationX, y: nativeEvent.locationY });
    }
  };

  const handleTouchEnd = () => {
    setMoving(false);
  };

  return (
    <View>
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Loading...</Text>
        </View>
      ) : (
        <View>
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

              const camera = new THREE.PerspectiveCamera(
                50,
                gl.drawingBufferWidth / gl.drawingBufferHeight,
                0.1,
                1000
              );
              camera.position.set(0, 1, 20);
              camera.lookAt(0, 1, 20);

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
        </View>
      )}
    </View>
  );
};

export default CarViewer;
