import React from 'react';
import { View, Button, TouchableOpacity, Text, PanResponder } from 'react-native';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';

class MainDrawing extends React.Component {
  state = {
    canvasTop: 0,
    canvasLeft: 0,
  };

  viewShot = React.createRef();
  canvas = null;
  ctx = null;
  lines = [];
  currentLine = [];
  currentLine = { points: [], color: 'black' };
  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      const { pageX, pageY } = event.nativeEvent;
      const { canvasTop, canvasLeft } = this.state;
      const x = pageX - canvasLeft;
      const y = pageY - canvasTop;
      
      if (x >= 0 && x <= this.canvas.width && y >= 0 && y <= this.canvas.height) {
        this.currentLine = { points: [], color: this.ctx.strokeStyle };
        this.lines.push(this.currentLine);
      }
    },
    onPanResponderMove: (event) => {
      const { pageX, pageY } = event.nativeEvent;
      const { canvasTop, canvasLeft } = this.state;
      const x = pageX - canvasLeft;
      const y = pageY - canvasTop;
    
      if (x >= 0 && x <= this.canvas.width && y >= 0 && y <= this.canvas.height) {
        this.currentLine.points.push([x, y]);
    this.redraw();
      }
    },
    onPanResponderRelease: () => {
      this.redraw();
    },
  });

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 5;
  }

  handleCanvas = (canvas) => {
    if (canvas) {
      this.canvas = canvas;
      this.canvas.width = 300;
      this.canvas.height = 500;
      this.ctx = canvas.getContext('2d');
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 5;
    }
  };

  onCanvasLayout = (event) => {
    this.setState({
      canvasTop: event.nativeEvent.layout.y,
      canvasLeft: event.nativeEvent.layout.x,
    });
  };

  handleColor = (color) => {
    this.ctx.strokeStyle = color;
  };

  handleEnd = async () => {
    if (this.viewShot.current) {
      this.viewShot.current.capture().then(uri => {
        console.log("do something with ", uri);
      });
    }
  };

  redraw = () => {
    this.ctx.clearRect(0, 0, 300, 500);
    this.lines.forEach((line) => {
      this.ctx.strokeStyle = line.color;
      this.ctx.beginPath();
      line.points.forEach(([x, y], i) => {
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      });
      this.ctx.stroke();
    });

  };

  render() {
    const colors = ['black', 'white', 'red', 'blue', 'green', 'yellow'];
    return (
      <View {...this.panResponder.panHandlers}>
        <Canvas ref={this.handleCanvas} style={{width: 300, height: 500}} onLayout={this.onCanvasLayout} />
        <View style={{flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap'}}>
          {colors.map((color) => (
            <TouchableOpacity key={color} onPress={() => this.handleColor(color)}>
            <View style={{backgroundColor: color, width: 40, height: 40, margin: 10, borderWidth: 2, borderColor: 'gray'}} />
          </TouchableOpacity>
          
          ))}
        </View>
        <Text style={{textAlign: 'center', fontSize: 30, fontWeight: 'bold', marginTop: 20, backgroundColor: '#f5f5dc'}}>글자</Text>
        <TouchableOpacity onPress={this.handleEnd} style={{width: 100, height: 100,marginTop: 50,marginLeft: 130, backgroundColor: 'blue', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: 'white'}}>완료</Text>
          </TouchableOpacity>
      </View>
    );
  }

}

export default MainDrawing;
