Created a backend utilizing Perspective API. 
Simple end points accessed through '/suggestion' and '/'.
/suggestion creates a post request sending user text on the suggestion board to Google's Perspective API to give it a toxicity score. Anything under .1 is allowed to write to the DB.
This is basically the best solution I found to the suggestion board. It does filter out a lot of safe to use words, EG. Black Cherry => gives a score of .2 out of 1, better safe than sorry.

Short and simple. Revisiting some of this after deployment. I'm almost 100% cors errors are gonna beat the crap out of this on deployment lol.
