let Tone, parent;

class VideoSpeakerManager {
  constructor(t, starting) {
    console.log("building the manager");
    Tone = t;
    parent = this;

    this.speakers = [];
    this.speakCount = 4;
    this.active = [0, 2];
    this.output = new Tone.Channel(-18);

    this.initSpeakers(starting);

    const vids = document.querySelectorAll("video.loader-single");
    vids.forEach(el => {
      el.addEventListener("playing", function(e) {
        const index = parseInt(e.target.dataset.loader);
        const pindex = parseInt(e.target.dataset.player);

        parent.active[index] = index * 2 + pindex;
        // parent.speakers[index].buildSpeaker(e.target);
      })
    })
  }

  initSpeakers() {
    for (let i = 0; i < this.speakCount; i++) {
      this.speakers[i] = new VideoSpeaker(this.output);
      this.speakers[i].initSpeaker(i);
    }
  }

  hearPerson() {
    const speak = this.active[Math.floor(Math.random() * this.active.length)];
    console.log("rando-picking " + speak);
    this.speakers[speak].hearPerson();
  }
}


class VideoSpeaker {
  constructor(output) {
    this.speaker = {};
    this.gain = new Tone.Gain(0);
    this.output = output;
  }

  initSpeaker(index) {
    console.log("calling initspeaker??");
    const video = document.querySelector(`video.video-${index}`);
    this.buildSpeaker(video);
  }

  buildSpeaker(video) {
    this.gain.gain.value = 0;
    video.volume = 0;

    this.speaker = Tone.context.createMediaElementSource(video);
    Tone.connect(this.speaker, this.gain);
    Tone.connect(this.gain, this.output);

    video.volume = 1;
    this.gain.gain.value = 0;
  }

  hearPerson() {
    this.gain.gain.setValueAtTime(1, 0.1);
    this.gain.gain.setValueAtTime(0, "+1.35");
  }
}

export default VideoSpeakerManager;