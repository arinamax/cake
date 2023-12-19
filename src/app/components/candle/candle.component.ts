import { Component, Input } from '@angular/core';
import { animate, keyframes, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { Candle } from '../cake/cake.component';

@Component({
  selector: 'app-candle',
  templateUrl: './candle.component.html',
  styleUrls: ['./candle.component.scss'],
  animations: [
    trigger('flyInOut',
      [
        transition('* => *', [
          query(':enter', style({opacity: 0}), { optional: true }),
          query(':enter', stagger(100, [
            animate(300, keyframes([
              style({opacity: 0, transform: 'translateY(-100%)', offset: 0}),
              style({opacity: 1, transform: 'translateY(0)',     offset: 1.0})
            ]))
          ]), { optional: true}),
        ])
      ]

    )]

})
export class CandleComponent {
  @Input() coords: {x: string, y: string} = {x: '50%', y: '50%'};
  @Input() candle: Candle | null = null;
  @Input() index: number = 0;

}
