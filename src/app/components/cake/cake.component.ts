import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { combineLatest, debounceTime, filter, map, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Candle {
  x: string,
  y: string,
  flaming: boolean,
}

@Component({
  selector: 'app-cake',
  templateUrl: './cake.component.html',
  styleUrls: ['./cake.component.scss'],

})
export class CakeComponent implements AfterViewInit {

  icingWidth = 300;
  icingHeight = 70;
  count = 0;
  showFairWorks = false
  stream: MediaStream

  candles: Candle[] = []
  // @ViewChild('svg') elementRef: ElementRef;

  constructor(private renderer: Renderer2,
              private _snackBar: MatSnackBar,
              ) {
  }

  ngAfterViewInit() {
    this.autoFill()

    // this.resetSvgRectColors();
  }

  async getVolume(audioMediaStreamTrack: MediaStreamTrack): Promise<void> {
    const { mediaStreamAudioSourceNode, samples } =
      await this.initializeAudioTrackVolumeMeter(audioMediaStreamTrack);

    const checkVolume = (res) => {
      const volume = this.computeVolume(samples());
      if (volume >= 6) {
        if (this.candles.some(candle => candle.flaming)) {
          this.candles.find(candle => candle.flaming).flaming = false
          if (this.candles.every(item => !item.flaming)) {
            this.showFairWorks = true;
          }
        } else {
          this.stopMic();
        }
      }
      if (audioMediaStreamTrack.readyState === 'live') {
        setTimeout(() => {
          requestAnimationFrame(checkVolume)
        }, 300)
        console.log('listening')
      } else {
        mediaStreamAudioSourceNode.disconnect();
        // this.computeVolume(null);
      }
    };

    requestAnimationFrame(checkVolume)
  }

  async initializeAudioTrackVolumeMeter(
    audioMediaStreamTrack: MediaStreamTrack
  ): Promise<{
    mediaStreamAudioSourceNode: MediaStreamAudioSourceNode;
    samples: Function;
  }> {
    const audioContext = new AudioContext();
    const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(
      new MediaStream([audioMediaStreamTrack])
    );
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 1024;
    analyserNode.smoothingTimeConstant = 0.5;

    mediaStreamAudioSourceNode.connect(analyserNode);

    const sampleArray = new Uint8Array(analyserNode.frequencyBinCount);

    const samples = () => {
      analyserNode.getByteFrequencyData(sampleArray);
      return sampleArray;
    };

    return { mediaStreamAudioSourceNode, samples };
  }

  private computeVolume(samples: Uint8Array): number {
    const bufferLength = samples.length;
    const values = samples.reduce((acc, curr) => acc + curr, 0);

    const logValue = Math.log10(values / bufferLength / 3);
    const computedValue = isNaN(logValue) ? 0 : logValue * 7;
    const mappedValue = Math.floor((computedValue / 10) * 9);
    return Math.min(9, Math.max(0, mappedValue));
  }

  public icingClick(e: any): void {
    this.showFairWorks = false;
    this.candles.push({x: `${e.offsetX}px`, y: `${e.offsetY - 60}px`, flaming: true})
  }

  public autoFill(): void {
    this.showFairWorks = false;
    if (this.count <= this.candles.length) {
      this.candles = [];
      this.fillCandles(this.count)
      return;
    }
    if (this.count > this.candles.length) {
      const candlesLeft = this.count - this.candles.length;
      this.fillCandles(candlesLeft);
    }
  }

  private fillCandles(num: number): void {
    for (let i = 0; i < num; i++) {
      const randomX = Math.round(Math.random() * this.icingWidth) + 10;

      let opasno = false
      if (randomX < 80 || randomX > 250) {
        opasno = true;
      }

      let randomY;
      if (opasno) {
        randomY = Math.round(Math.random() * 30 + 40);
      } else {
        randomY = Math.round(Math.random() * this.icingHeight);
      }

      this.candles.push({x: `${randomX}px`, y: `${randomY - 60}px`, flaming: true})
    }
  }


  public mic(): void {
    if (this.stream) {
      this.stopMic();
      return;
    }

    if (!this.candles.length) {
      this.openSnackBar();
      return;
    }

    this.showFairWorks = false;
    navigator.mediaDevices.getUserMedia({ audio: true }).then((res: MediaStream) => {
      this.stream = res
      this.getVolume(this.stream.getTracks()[0])
    });
  }

  private openSnackBar(): void {
    this._snackBar.open('Put the candles in the cake first!', 'OK');
  }

  public stopMic(): void {
    this.stream?.getTracks().forEach((item: MediaStreamTrack) => {
      item.stop();
    })
    this.stream = null
  }

  // private resetSvgRectColors(rectElements?: NodeListOf<SVGRectElement>): void {
  //   rectElements =
  //     rectElements || this.elementRef.nativeElement.querySelectorAll('rect');
  //
  //   rectElements.forEach((rect: SVGRectElement) => {
  //     this.renderer.setStyle(rect, 'fill', '#ff3f3f');
  //   });
  // }

  // private updateSvgRectColorsFromSamples(samples: Uint8Array): void {
  //   if (!samples) {
  //     this.resetSvgRectColors();
  //     return;
  //   }
  //
  //   const volume = this.computeVolume(samples);
  //   this.updateSvgRectColors(volume);
  // }

  // private updateSvgRectColors(volume: number): void {
  //   const svgElement = this.elementRef.nativeElement;
  //   const rectElements = svgElement.querySelectorAll('rect');
  //
  //   this.resetSvgRectColors(rectElements);
  //   const rectCount = rectElements.length;
  //   const volumeLimit = Math.min(volume, rectCount);
  //
  //   for (let i = 0; i < volumeLimit; i++) {
  //     const rect = rectElements[i];
  //     this.renderer.setStyle(rect, 'fill', '#000');
  //   }
  // }

  public light(): void {
    this.candles.forEach(candle => candle.flaming = true);
    this.showFairWorks = false;
  }

}
