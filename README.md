# Galaxy Quest scoring system

## Demo

This prototype requires Python 3 with the `skimage` package (and `matplotlib`)
installed. Type the following to launch the demo:

```
git clone https://github.com/PillarsOfCreationTeam/scoring.git
cd scoring
python3 -m http.server --cgi 8000
```

Then, the demo will be available at `http://localhost:8000`.

## Description

This is a scoring system prototype for the Galaxy Quest game (see main repo).
In this game, users will help NASA to identify galaxy boundaries and nebula
axes, i.e., tasks that may be difficult for AIs, are quite *human readable*.

The scoring system is based on the *wisdom of the crowd*. For each Hubble image,
the backend stores a mask that is a moving average of the individual draws. The
game rewards users that are able to match their draws with the masks, thus
earning *Hubble time* to continue the game exploration.

For example, this is the status of the mask after a test with 52 participants:

![Galaxy with mask](/../master/examples/galaxy-mask.jpg?raw=true)

In a real implementation, there could be a tier-based, or reputation-based,
weighting system in which best performing players would have more influence on
the mask of new images.
