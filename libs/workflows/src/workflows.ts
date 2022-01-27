import {
  proxyActivities,
  defineSignal,
  setHandler,
  sleep,
  defineQuery,
  workflowInfo,
} from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

const { greet, updateMessage, getRow } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export const newPlayerSignal = defineSignal<string[]>('newPlayer');
export const playerThrowsSignal =
  defineSignal<{ player: string; throws: 'rock' | 'paper' | 'scissor' }[]>(
    'playerThrows'
  );
export const getPlayersQuery = defineQuery<string[]>('getPlayers');
export const getToThrowMessageQuery = defineQuery<string>('getThrowMessage');
export const setMessageInfoSignal =
  defineSignal<{ messageId: string; channelId: string }[]>('setMessageInfo');

/** A workflow that simply calls an activity */
export async function example(name: string): Promise<string> {
  return await greet(name);
}

export async function RPS(): Promise<string[]> {
  const { workflowId } = workflowInfo();
  const players = new Set<string>();
  let messageId: string;
  let channelId: string;
  setHandler(newPlayerSignal, (player: string) => void players.add(player));
  setHandler(setMessageInfoSignal, (props) => {
    messageId = props.messageId;
    channelId = props.channelId;
  });
  setHandler(getPlayersQuery, () => Array.from(players));

  await sleep('30 seconds');

  const throws = {};

  const getMessage = () => {
    const messages = [];
    for (const player of players) {
      if (!throws[player]) {
        messages.push(`${player}`);
      } else {
        messages.push(`~~${player}~~`);
      }
    }
    return messages.join(':');
  };

  // const row = await getRow()
  await updateMessage(
    {
      content: getMessage(),
      components: [
        {
          components: [
            {
              custom_id: `Throw:${workflowId}:rock`,
              disabled: false,
              emoji: null,
              label: 'Rock',
              style: 1,
              type: 2,
              url: null,
            },
            {
              custom_id: `Throw:${workflowId}:paper`,
              disabled: false,
              emoji: null,
              label: 'Paper',
              style: 1,
              type: 2,
              url: null,
            },
            {
              custom_id: `Throw:${workflowId}:scissors`,
              disabled: false,
              emoji: null,
              label: 'Scissors',
              style: 1,
              type: 2,
              url: null,
            },
          ],
          type: 1,
        },
      ],
    },
    messageId,
    channelId
  );

  setHandler(getToThrowMessageQuery, getMessage);

  setHandler(playerThrowsSignal, ({ player, throws: _throw }) => {
    if (players.has(player)) {
      throws[player] = _throw;
    }
  });

  await sleep('30 seconds');

  const results = Array.from(players).reduce((acc, player) => {
    acc[player] = 0;
    return acc;
  }, {});

  // compare results
  players.forEach((player1) => {
    players.forEach((player2) => {
      if (player1 === player2) return;
      const throw1 = throws[player1];
      const throw2 = throws[player2];
      if (throw1 === throw2) {
        results;
      } else if (
        (throw1 === 'rock' && throw2 === 'scissors') ||
        (throw1 === 'paper' && throw2 === 'rock') ||
        (throw1 === 'scissors' && throw2 === 'paper')
      ) {
        results[player1] = results[player1] ? results[player1]++ : 1;
      } else {
        results[player2] = results[player2] ? results[player2]++ : 1;
      }
    });
  });

  await updateMessage(
    {
      content: `Results\n \`\`\`json\n${JSON.stringify(
        results,
        null,
        2
      )}\`\`\``,
      components: [],
    },
    messageId,
    channelId
  );

  return;
}
