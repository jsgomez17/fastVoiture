import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import { FaceDetector } from "expo-face-detector";
import { DangerZone } from "expo";

export default class CameraRecon extends React.Component {
  static defaultProps = {
    countDownSeconds: 5,
    motionInterval: 500, // ms between each device motion reading
    motionTolerance: 1, // allowed variance in acceleration
    cameraType: Camera.Constants.Type.front, // front vs rear facing camera
  };

  state = {
    hasCameraPermission: null,
    faceDetecting: false, // when true, we look for faces
    faceDetected: false, // when true, we've found a face
    countDownSeconds: 5, // current available seconds before photo is taken
    countDownStarted: false, // starts when face detected
    pictureTaken: false, // true when photo has been taken
    motion: null, // captures the device motion object
    detectMotion: false, // when true we attempt to determine if device is still
  };

  countDownTimer = null;

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });

    this.motionListener = DangerZone.DeviceMotion.addListener(
      this.onDeviceMotion
    );
    setTimeout(() => {
      this.detectMotion(true);
    }, 5000);
  }

  componentWillUnmount() {
    if (this.motionListener) {
      this.motionListener.remove();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.detectMotion && prevState.motion !== this.state.motion) {
      if (
        Math.abs(this.state.motion.x - prevState.motion.x) <
          this.props.motionTolerance &&
        Math.abs(this.state.motion.y - prevState.motion.y) <
          this.props.motionTolerance &&
        Math.abs(this.state.motion.z - prevState.motion.z) <
          this.props.motionTolerance
      ) {
        // still
        this.detectFaces(true);
        this.detectMotion(false);
      }
    }
  }

  detectMotion = (doDetect) => {
    this.setState({
      detectMotion: doDetect,
    });
    if (doDetect) {
      DangerZone.DeviceMotion.setUpdateInterval(this.props.motionInterval);
    } else if (!doDetect && this.state.faceDetecting) {
      this.motionListener.remove();
    }
  };

  onDeviceMotion = (rotation) => {
    this.setState({
      motion: rotation.accelerationIncludingGravity,
    });
  };

  detectFaces(doDetect) {
    this.setState({
      faceDetecting: doDetect,
    });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.props.cameraType}
            onFacesDetected={
              this.state.faceDetecting ? this.handleFacesDetected : undefined
            }
            onFaceDetectionError={this.handleFaceDetectionError}
            faceDetectorSettings={{
              mode: FaceDetector.Constants.Mode.fast,
              detectLandmarks: FaceDetector.Constants.Mode.none,
              runClassifications: FaceDetector.Constants.Classifications.all,
            }}
            ref={(ref) => {
              this.camera = ref;
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row",
                position: "absolute",
                bottom: 0,
              }}
            >
              <Text style={styles.textStandard}>
                {this.state.faceDetected ? "Face Detected" : "No Face Detected"}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                display:
                  this.state.faceDetected && !this.state.pictureTaken
                    ? "flex"
                    : "none",
              }}
            >
              <Text style={styles.countdown}>
                {this.state.countDownSeconds}
              </Text>
            </View>
          </Camera>
        </View>
      );
    }
  }

  handleFaceDetectionError = () => {
    // Manejo de errores de detección de caras
  };

  handleFacesDetected = ({ faces }) => {
    if (faces.length === 1) {
      this.setState({
        faceDetected: true,
      });
      if (!this.state.countDownStarted) {
        this.initCountDown();
      }
    } else {
      this.setState({ faceDetected: false });
      this.cancelCountDown();
    }
  };

  initCountDown = () => {
    this.setState({
      countDownStarted: true,
    });
    this.countDownTimer = setInterval(this.handleCountDownTime, 1000);
  };

  cancelCountDown = () => {
    clearInterval(this.countDownTimer);
    this.setState({
      countDownSeconds: this.props.countDownSeconds,
      countDownStarted: false,
    });
  };

  handleCountDownTime = () => {
    if (this.state.countDownSeconds > 0) {
      let newSeconds = this.state.countDownSeconds - 1;
      this.setState({
        countDownSeconds: newSeconds,
      });
    } else {
      this.cancelCountDown();
      this.takePicture();
    }
  };

  takePicture = async () => {
    this.setState({
      pictureTaken: true,
    });
    if (this.camera) {
      const photo = await this.camera.takePictureAsync();
      console.log("Photo taken", photo);
      this.onPictureSaved(photo);
    }
  };

  onPictureSaved = () => {
    this.detectFaces(false);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textStandard: {
    fontSize: 18,
    marginBottom: 10,
    color: "white",
  },
  countdown: {
    fontSize: 40,
    color: "white",
  },
});
