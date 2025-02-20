# TODO

- remove category field from ui

- create getCategories()
- create editVocab(id)

- structure output request whenever a tile is added to:
    - fix the accents used in the tile (e.g. cam on -> Cám Ơn)
    - append a modified translation to the existing english translation iff the existing one is totally incorrect
    - use getCategories to attempt to find a suitable existing category (make a new one if needed)

### UI changes

- remove heading -> make the whole page more minimalist
- add word should be a button that expands it, button tucked away from the vocab list
- dark/light mode
- colours.js
- optimise for vertical mobile use
- add edit word button to UI that allows in place editing of all aspects (viet|eng|category)