let Tone;
let osc, gain, dist, autofilt, autopan, verb;
const notes = ["G2", "A2", "C3", "D3"];

class ClickCounter {
  constructor(t) {
    console.log("building clickcounter");
    Tone = t;
    this.inSpree = false;
    this.playingNote = false;
    this.lastTotal = 0;
    this.clickTotal = 0;

    osc = new Tone.OmniOscillator("A2", "pwm").start();
    dist = new Tone.Distortion(0.1);
    autofilt = new Tone.AutoFilter(3).start();
    autopan = new Tone.AutoPanner("8n").start();
    verb = new Tone.JCReverb(0.6);
    gain = new Tone.Channel(-90);

    osc.chain(dist, gain, autofilt, autopan, verb, Tone.getDestination());
  }

  clickometer() {
    console.log("running meter");
    Tone.Transport.scheduleRepeat(() => {
      const rate = this.clickTotal - this.lastTotal;
      this.inSpree = rate >= 2 ? true : false;
      this.lastTotal = this.clickTotal;
      
      this.playNote();
    }, 0.5);

    if (Tone.Transport.state != "started") {
      Tone.Transport.start();
    }
  }

  playNote() {
    if (this.inSpree && !this.playingNote) {
      this.playingNote = true;
      const note = this.randomNote();
      osc.frequency.value = note;
      gain.volume.rampTo(-37, 0.5);
      autofilt.frequency.value = Math.random() * 3 + 3;
      autopan.frequency.value = Math.random() * 3 + 3;
    }
    
    else if (!this.inSpree) { 
      this.playingNote = false;
      gain.volume.rampTo(-90, 3);
    }
  }

  randomNote() {
    const index = Math.floor(Math.random() * notes.length);
    return notes[index];
  }

  changeTotal(i) {
    this.clickTotal = i;
  }
}

export default ClickCounter;