/* eslint-disable no-unused-vars */
import patchList from "./HydraMixer.js";
import Hydra from "hydra-synth";
// const loop = require('raf-loop');

class HydraHandle {
  constructor() {
    this.timeInterval = 1000;
    const h = this.initPatch("#hydra-large", 800, 450, this.randomPatch());
    const h2 = this.initPatch("#hydra-small", 400, 225, this.randomPatch());

    this.patches = [h, h2];
  }

  initPatch(canvasID, width, height, func) {
    const h = new Hydra({
      makeGlobal: false,
      detectAudio: false,
      canvas: document.querySelector(canvasID),
      width: width,
      height: height,
      numSources: 1,
      numOutputs: 1,
      // autoLoop: false
    }).synth;

    h.setResolution(width, height);
    h.patch = func;
    h.timeInterval = this.timeInterval;
    h.isManualRunning = false;
    h.isAutoRunning = false;
    // h.rafEngine = loop((dt) => { h.tick(dt); })

    // this.renderSwitch(h);

    return h;
  }

  renderSwitch(h) {
    if (h.timeInterval > 100) {
      console.log("switch to manual mode");
      h.rafEngine.stop();
      h.isAutoRunning = false;

      if (!h.isManualRunning) {
        (function loop() {
          setTimeout(() => {
            h.isManualRunning = true;
            h.tick(h.timeInterval);
            if (h.timeInterval > 100 && h.isManualRunning) {
              loop();
            } else {
              h.isManualRunning = false;
            }
          }, h.timeInterval);
        })();
      }
    } 
    
    else if (!h.isAutoRunning) {
      console.log("switch to requestanimation");
      h.isAutoRunning = true;
      h.rafEngine.start();
    }
  }

  runAll(data) {
    for (let i = 0; i < this.patches.length; i++) {
      this.patches[i].timeInterval = data.speed / 4;
      // this.renderSwitch(this.patches[i]);
      this.runOne(i, data);
    }
  }

  runOne(index, data) {
    try {
      this.patches[index].patch(this.patches[index], data);
    } catch(e) {
      console.log(e);
      console.log("error happend on patch " + index);
    }
    
  }

  videoNotify(player, patch) {
    // this.patches[patch].stop();
    this.patches[patch].s0.init({ src: player, dynamic: true });
    // this.patches[patch].start();
  }

  switchOne() {
    const p = Math.random() > 0.5 ? 0 : 1;
    this.patches[p].patch = this.randomPatch();
  }

  revealOne(data) {
    const p = Math.random() > 0.5 ? 0 : 1;
    const h = this.patches[p];
    const _this = this;

    h.patch = mutedPatch;
    this.runOne(p);
    setTimeout(() => {
      h.patch = _this.randomPatch();
      _this.runOne(p, data);
    }, (Math.random() * 1500) + 500);
  }

  changePatches(data) {
    this.patches[0].patch = this.randomPatch();
    this.patches[1].patch = this.randomPatch();

    this.runAll(data);
  }

  randomPatch() {
    const p = patchList[Math.floor(Math.random() * patchList.length)];
    return p;
  }
}

function mutedPatch(h) {
  h.src(h.s0).out(h.o0);
  h.render(h.o0);
}

export default HydraHandle;