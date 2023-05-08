# Team Code Review
## Procedure
For our team code review, we recursively explored the relevant views, components, and libraries as they appeared sequentially in the main game loop (the entry point can be found at (```views/CanvasView/script.js```). We also looked at the core loop logic, and discussed any optimizations that could be made as such. As we found present issues in the code iteslf or with gameplay funtionality, we took a deeper-dive into that issue and discussed ways to solve it. We proceeded to formally open each issue we found during the code review within Github.

## Issues
The [first issue](https://github.com/maxpatiiuk/eecs-448-pixelland/issues/46) we found was with regards to the player position as the viewport changed size. The player position is supposed to always remain in the absolute center of the screen, and this bug presented itself by shifting the center coordinates when the viewport dimesnions change. Max made the inference that this could be fixed by shifting the cartesian plane's origin to the center of the screen, equal to the intended player position.

We brainstormed ideas for what might have been causing this, and then Max went ahead and implemented a fix later down the line. 

The [second issue](https://github.com/maxpatiiuk/eecs-448-pixelland/issues/47) was more of a fundamental change (a 'nice to have') in the context of player movement. The original implementation of player movement was akin to the video game "Pokemon," where the player's movement was bound by the entire cell. It was impossible for you to move granularly between cells. This was a quality-of-life issue that we collectively decided would be worth-while to implement.

Max had some specific ideas on how to improve the rendering by shifting cells and rendering the borders instead of redrawing the entire map each frame.

The [third issue](https://github.com/maxpatiiuk/eecs-448-pixelland/issues/50) we discovered was with regards to saving and loading worlds. Our intended functionality of the save/load function was to be able to save and come back to the exact same world (RainbowLand, Minecraft, or otherwise). When testing this functionality, we discovered that saving an instance of RainbowLand and attempting to reload it would load a Minecraft world instead.

Max was assigned this issue, and we discovered that the problem was that the current map type was not being remembered properly, and on top of that a random seed was being used for the reloading.

The [fourth issue](https://github.com/maxpatiiuk/eecs-448-pixelland/issues/51) we found was during some performance testing. Within Pixelland is the ability to zoom in/out which, in essence, re-renders the map with a reduced/increased cell-size, allowing the same dimesnions of viewport to contain more cells (zooming out) or less cells (zooming in). When zooming out, there is a distinct reduction in performce as the game tries to redraw all of these new cells. We determined that this wasn't just an issue with zooming out, but spoke to a more general need for performance optimizations in the game as a whole. We decided it would be worth-while to prioritize the optimization of the rendering engine, so that the game is more playable for more people.

As a group, we helped Max with performance testing as he implemented new optimizations.


