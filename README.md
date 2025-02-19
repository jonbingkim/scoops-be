Created a backend utilizing Perspective API. 
Simple end points accessed through '/suggestion' and '/'.
/suggestion creates a post request sending user text on the suggestion board to Google's Perspective API to give it a toxicity score. Anything under .1 is allowed to write to the DB.
This is basically the best solution I found to the suggestion board. It does filter out a lot of safe to use words, EG. Black Cherry => gives a score of .2 out of 1, better safe than sorry.


Update: Looking to use lambda functions since there isn't much use for a live server on ec2. Seems like the better way to do it. Deployment coming soon. 
