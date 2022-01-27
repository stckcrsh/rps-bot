# Process

1. slash command to start the game
  >  * kicks off the workflow with the information
  >    * userID
  >    * channelID
  >    * guildID
2. a message is added for players to join by clicking a button 
  >  * Activity that creates the message in the channel
  >  * onClick of the button we need to send a signal to the workflow with userID
3. when players have joined the game is started by clicking the start button
  * onClick of the start button send a start signal to the worklfow
4. message is created with buttons Rock, Paper, Scissors
  * Race condition either
    1. all players respond 
    2. a timer goes off
5. scores are shown with 1 point per player that you beat
  * Conditional
    1. if one player has highest score they win go to 6
    2. if there is a tie go back to step 4 with only the tied players
6. Display winner in thread
