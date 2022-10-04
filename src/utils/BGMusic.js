import notes from "../data/notes.json";
import chords from "../data/chords.json";
let chordIndex, activeChordPlayer;
let Tone;

class BGMusic {
  constructor(t, loadBack) {
    Tone = t;
    this.loadThresh = 3;
    this.doneLoading = 0;
    this.loadBack = loadBack;
    
    this.sendVerb = new Tone.Channel();
    this.sendVerb.send("reverb");

    const fades = { fadeIn: 10, fadeOut: 30 }
    this.notes = this.initPlayer(notes.file, -88);
    this.chords = [
      this.initPlayer(chords.file, -8, fades),
      this.initPlayer(chords.file, -8, fades)
    ];

    this.maps = {};
    this.maps.notes = notes.spritemap;
    this.maps.chords = chords.spritemap;

    // feedback nodes
    this.delay = new Tone.FeedbackDelay("0.15", 0.7);
    this.reverb = new Tone.Reverb(8).toDestination();
    this.getVerb = new Tone.Channel({ volume: -6 });
    this.getVerb.receive("reverb");

    // various connections
    this.delay.connect(this.reverb);
    // reverb.connect(pitchShift);

    this.pitchShift = new Tone.PitchShift().toDestination();
    this.sendVerb.connect(this.pitchShift);
    this.pitchShift.wet.value = 0.5;
  }

  initPlayer(file, volume, settings) {
    const parent = this;
    const p = new Tone.Player(file, () => {
      parent.doneLoading++;
      // console.log(Tone.Time(p.buffer.length, "samples").toSeconds());

      if (parent.doneLoading >= 3) {
        parent.loadBack();
      }
    });

    p.volume.value = volume;
    p.connect(this.sendVerb);
    if (settings) {
      for (let s of Object.keys(settings)) {
        p[s] = settings[s];
      }
    }
    return p;
  }
  
  startBackground() {
    this.playChord();
    this.playNote();
  }

  // somewhere between four and eleven seconds
  playNote() {
    this.notes.volume.rampTo(-6, 10, Tone.now());
    this.playRandomSound(this.notes, this.maps.notes);

    this.notes.onstop = () => {
      console.log("next note!");
      const delay = Math.random() * 12.0 + 4.5;
      this.playRandomSound(this.notes, this.maps.notes, delay);
    }
  }

  playChord() {
    chordIndex = 0;
    activeChordPlayer = 0;
    const keyMap = Object.keys(this.maps.chords);
    let key = keyMap[chordIndex];
    this.playSound(this.chords[0], this.maps.chords[key]);
    this.chords[activeChordPlayer].volume.rampTo(-8.0, 10, Tone.now());
    const offset = 0.5;

    const parent = this;
    let sound = this.maps.chords[key];
    let dur = (sound.end - sound.start) * offset * 1000;
    // console.log(dur);

    (function loop() {
      setTimeout(() => {
        parent.chords[activeChordPlayer].stop();
        
        activeChordPlayer = Math.abs(activeChordPlayer - 1);
        chordIndex = (chordIndex + 1) % keyMap.length;
        key = keyMap[chordIndex];
        parent.playSound(parent.chords[activeChordPlayer], parent.maps.chords[key]);
        
        sound = parent.maps.chords[key];
        dur = (sound.end - sound.start) * offset * 1000;
        loop();
      }, dur);
    })();
  }

  playSound(player, sound, delay = 0) {
    player.start(Tone.now() + delay, sound.start, sound.end - sound.start);
  }

  playRandomSound(player, map, delay = 0) {
    const index = Math.floor(Math.random() * Object.keys(map).length);
    const soundName = Object.keys(map)[index];
    const sound = map[soundName];
    this.playSound(player, sound, delay);
  }

  randomShift() {
    console.log("triggering a shift");
    // const target = (Math.random() * 14 + 6) * (Math.random() > 0.5 ? -1 : 1);
    const target = (Math.random() * 10 + 4) * -1;
    // console.log("target is " + target);
    // pitchShift.pitch = val;
    let gate = false;
    // let interval = setInterval(() => pitchInterval(interval, val, gate), 100);
    // speakers.hearPerson();

    let interval = setInterval(() => {
      if (target < 0) {
        // console.log("target is negative");
        // console.log("going up " + this.pitchShift.pitch);
        if (this.pitchShift.pitch <= target || gate) {
          gate = true;
          this.pitchShift.pitch -= target / 20.0;

          if (this.pitchShift.pitch >= 0) {
            this.pitchShift.pitch = 0;
            clearInterval(interval);
          }
        } else {
          // console.log("going down " + this.pitchShift.pitch);
          this.pitchShift.pitch += target / 20.0;
        }  
      } 

      // target is positive: go up, then down
      else {
        console.log("target is positive");
        if (this.pitchShift.pitch >= target || gate) {
          // console.log("going down " + this.pitchShift.pitch);
          gate = true;
          this.pitchShift.pitch -= target / 20.0;

          if (this.pitchShift.pitch <= 0) {
            this.pitchShift.pitch = 0;
            clearInterval(interval);
          }
        } else {
          // console.log("going up " + this.pitchShift.pitch);
          this.pitchShift.pitch += target / 20.0;
        }
      }
    }, 20);

    // console.log("feedbackdelay?");
    this.delay.feedback.rampTo(1, 1);
    // feedbackDelay.delayTime.rampTo(0.1, 0.3);
    this.delay.feedback.rampTo(0.7, 1.5, "+2");
    // feedbackDelay.delayTime.rampTo(0.15, 0.5, "+0.5");

    // setInterval(() => console.log(quarterNote.toSeconds(), 1000);
    // pitchShift.pitch = val;
  }
}

export default BGMusic;