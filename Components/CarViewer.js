import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import * as THREE from 'three';
import { GLView } from 'expo-gl';

const CarViewer = () => {
  const containerRef = useRef();

  const onContextCreate = async (gl) => {
    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000); // Adjust aspect ratio

    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ context: gl, antialias: true });

    // Set the size of the renderer
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Load the 3D model from the provided URL
    const modelURL = 'https://file.io/uHzlZO8qNkhV'; // Replace with your model URL
    const loader = new THREE.OBJLoader();
    console.log(modelURL)
    loader.load(modelURL, (geometry) => {
      // Create a material
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const mesh = new THREE.Mesh(geometry, material);

      // Add the mesh to the scene
      scene.add(mesh);

      // Set the camera position
      camera.position.z = 5;

      // Create an animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        gl.endFrameEXP(); // Important for Expo's GLView
      };

      animate();
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} ref={containerRef} />
    </View>
  );
};

export default CarViewer;
