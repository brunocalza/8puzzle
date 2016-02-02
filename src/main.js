
import Cycle from '@cycle/core';
import {div, makeDOMDriver} from '@cycle/dom';
import Rx from 'rx';
import * as collection from 'lodash/collection';

function app(sources) {

  const moves = {
    37: +1, 
    38: +3,
    39: -1,
    40: -3
  };

  const state = [0,1,2,3,4,5,6,7,8];

  const keyups$ = sources.DOM.events('keyup')
                    .filter(e => [37, 38, 39, 40].includes(e.key || e.which))
                    .map(e => moves[e.key || e.which])
                    .startWith(0);

  const game$ = keyups$.scan((board, action) => {
    if (!state.includes(board.indexOf(0) + action)) {
      return board;
    }

    if ([2,5].includes(board.indexOf(0) + action) && action === -1) {
      return board;
    }

    if ([3,6].includes(board.indexOf(0) + action) && action === 1) {
      return board;
    }

    const index = board.indexOf(0);
    board[index] = board[index + action];
    board[index + action] = 0;
    return board;
  }, collection.shuffle(state));

  const vtree$ = game$.map(positions => {
                    return div(positions.map(number => {
                      return div({className: "block" + (number === 0 ? " invisible" : "")}, number.toString());
                    }));
                  });
  return { DOM: vtree$ };
}

Cycle.run(app, {
  DOM : makeDOMDriver('body')
});
