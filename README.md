# SPL Graph Viewer

A web-based tool for visualizing Sound Pressure Level (SPL) measurements from REW (Room EQ Wizard) exported data files.

## Features

- Interactive graph visualization of SPL measurements
- Support for multiple SPL metrics:
  - Current SPL (LCS)
  - Minimum SPL (LCSMin)
  - Maximum SPL (LCSMax)
  - Peak SPL (LZpeak)
  - Equivalent SPL (LCeq)
- Dark theme interface
- Interactive data point inspection
- Zoom and pan capabilities
- Touch device support

## Usage

1. Visit the hosted application at [your-github-username.github.io/spl-viewer]
2. Click "Choose File" to select your REW exported .txt file
3. Interact with the graph:
   - Scroll/pinch to zoom
   - Click and drag to pan
   - Click on data points to view detailed measurements
   - Double-click to reset view

## Local Development

To run this application locally:

1. Clone this repository
2. Open `index.html` in a web browser
3. No build process or dependencies required!

## File Format

The application expects a text file exported from Room EQ Wizard (REW) with the following columns:
- Time[s]
- LCS
- LCSMin
- LCSMax
- LZpeak
- LCeq
- Time of day (HH:mm:ss.SSS format)

## License

MIT License - Feel free to use and modify as needed!
