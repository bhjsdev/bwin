# Drag and drop refactor

I commented out enableGlassDrag() and enableDrop()

## Step 1

- create a `drag-new.js` file in binary-window directory
- if drag on the glass header, exclude on the action container and drag indictor(bw-glass-attach-indicator), it should hide the glass element and create a detached glass. this is "detach mode"
- note at this time, user has not released the mouser/pointer, the detached glass should behave a normal detached glass that can freely move around
- when drag is released, calculate the overlapping area between the dragged detached glass and original attached glass.
  - if the area is larger than 90% (use a variable for setting), meaning no intention of dragging, show back the hidden attached glass, remove the detached glass element
  - if the area is smaller than 90%, then remove the original pane, so the sibling pane will automatically take the space 

## Step 2

- create a `drop-new.js` file in binary-window directory
- when user drags on the drag indicator, it should enter the "attach mode".
- similar to Step 1, create a detached glass
- similar to what current drop.js does. when the cursor is moved to pane, check the position of the cursor, highlight the drop area.
- when user releases the detached glass, delete the detached glass and call `transferGlass` to move the elements to new attached glass
- note during dragging, it should still check the overlapping area same value in Step 1